package pw.mkr.craft.blocks.binding

import net.minecraft.block.Block
import net.minecraft.block.BlockState
import net.minecraft.block.entity.BlockEntity
import net.minecraft.entity.LivingEntity
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.item.ItemGroup
import net.minecraft.item.ItemStack
import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.stat.Stats
import net.minecraft.text.LiteralText
import net.minecraft.util.math.BlockPos
import net.minecraft.util.math.ChunkPos
import net.minecraft.world.GameMode
import net.minecraft.world.World
import pw.mkr.craft.events.chunkentry.ChunkEntryEvent
import pw.mkr.craft.events.chunkentry.ChunkEntryListener
import pw.mkr.craft.models.Binding
import pw.mkr.craft.models.Chunk
import pw.mkr.craft.models.toModel
import pw.mkr.craft.utils.StoreManager
import pw.mkr.craft.utils.Utils

class BindingBlock(settings: Settings) : Block(settings) {
    override fun onPlaced(
        world: World?,
        pos: BlockPos?,
        state: BlockState?,
        placer: LivingEntity?,
        itemStack: ItemStack?
    ) {
        if (Utils.isServer) {
            if (placer != null && world != null && pos != null && itemStack != null) {
                fun sendMessage(msg: String) = placer.sendSystemMessage(LiteralText(msg), placer.uuid)
                fun destroyBlock() = world.breakBlock(pos, true, placer)

                val blockChunk = ChunkPos(pos).toModel()

                // check if a binding already exists
                val existingBinding = StoreManager.chunkBoundTo(blockChunk)
                if (existingBinding != null) {
                    destroyBlock()
                    return sendMessage("This chunk has already been claimed by ${existingBinding.player}")
                }

                /**
                 * check if the player has already used their binding allowance
                 * a player's maximum allowed bindings are calculated using:
                 * 2 + (n * M) + d
                 *  n = player's play time in game ticks
                 *  M = static multiplier 1 / (20 * 60 * 60 * 24)
                 *  d = value from REST call to craftfactions server
                 */
                val playTime = (placer as ServerPlayerEntity).statHandler.getStat(
                    Stats.CUSTOM.getOrCreateStat(Stats.PLAY_TIME)
                )

                val playerBindings = StoreManager.totalBindingsOf(placer.name.asString())
                val maximumBindings = 2 + (playTime * Utils.DAY_MULTIPLIER) + 0

                if (playerBindings == maximumBindings) {
                    destroyBlock()
                    return sendMessage("You've already used (${playerBindings}/${maximumBindings}) bindings")
                }

                val binding = StoreManager.addBinding(
                    Binding(
                        blockChunk,
                        pos.toModel(),
                        itemStack.name.asString(),
                        placer.name.asString()
                    )
                )

                binding ?: return sendMessage("Failed to claim binding")

                sendMessage("You have claimed ${binding.claimRadius} chunks around $blockChunk")
                sendMessage("Bindings used: ${playerBindings + 1}/${maximumBindings}")
            } else Utils.logger.error("Binding block placed by unknown entity!")
        }
    }

    override fun onBreak(world: World?, pos: BlockPos?, state: BlockState?, player: PlayerEntity?) {
        if (Utils.isServer) {
            if (player != null && pos != null) {
                val binding = StoreManager.chunkBoundTo(ChunkPos(pos).toModel())

                // if this is a stray binding block that doesn't claim anything
                binding ?: return super.onBreak(world, pos, state, player)

                // this binding block is being broken by the claim owner
                if (player.name.asString() == binding.player)
                    return super.onBreak(world, pos, state, player)
            }
        } else super.onBreak(world, pos, state, player)
    }

    override fun afterBreak(
        world: World?,
        player: PlayerEntity?,
        pos: BlockPos?,
        state: BlockState?,
        blockEntity: BlockEntity?,
        stack: ItemStack?
    ) {
        super.afterBreak(world, player, pos, state, blockEntity, stack)

        if (Utils.isServer && player != null) {
            fun sendMessage(msg: String) = player.sendSystemMessage(LiteralText(msg), player.uuid)

            val binding = StoreManager.chunkBoundTo(ChunkPos(pos).toModel())
            binding ?: return

            val removedBinding = StoreManager.removeBinding(binding)
            removedBinding ?: sendMessage("Could not remove claim!")

            sendMessage("Removed claim of ${binding.claimRadius} chunks around ${binding.chunk}")
        }
    }

    companion object {
		fun register() {
			Utils.registerBlock(::BindingBlock, "portal_block", 4f, ItemGroup.MISC)

			ChunkEntryEvent.listen(object : ChunkEntryListener {
				override fun onChunkEntry(player: PlayerEntity, oldChunk: Chunk, newChunk: Chunk): Boolean {
					val oldBinding = StoreManager.chunkBoundTo(oldChunk)
					val newBinding = StoreManager.chunkBoundTo(newChunk)

					fun send(msg: String) = player.sendMessage(LiteralText(msg), false)
					fun inform(action: String, isPlayerClaimer: Boolean, binding: Binding) =
						send(
							"$action ${
								if (isPlayerClaimer) "your"
								else "${binding.player}'s"
							} claim"
						)

					val serverPlayer = player as ServerPlayerEntity
					val playerGameMode = serverPlayer.interactionManager.gameMode

					val isPlayerSurvival = playerGameMode == GameMode.SURVIVAL
					val isPlayerAdventure = playerGameMode == GameMode.ADVENTURE

					// player went inside a bound chunk
					if (newBinding != null && (oldBinding == null || newBinding == oldBinding)) {
						val isPlayerClaimer = newBinding.player == player.name.asString()

						if (isPlayerSurvival && !isPlayerClaimer)
							serverPlayer.changeGameMode(GameMode.ADVENTURE)

						inform("Entered", isPlayerClaimer, newBinding)
					}

					// player went out of a bound chunk
					if (oldBinding != null && newBinding == null) {
						val isPlayerClaimer = oldBinding.player == player.name.asString()

						if (isPlayerAdventure && !isPlayerClaimer)
							serverPlayer.changeGameMode(GameMode.SURVIVAL)

						inform("Left", isPlayerClaimer, oldBinding)
					}

					return true
				}
			})
		}
	}
}
