package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.text.LiteralText
import net.minecraft.world.GameMode
import pw.mkr.craft.blocks.binding.BindingBlock
import pw.mkr.craft.events.chunkentry.ChunkEntryEvent
import pw.mkr.craft.events.chunkentry.ChunkEntryListener
import pw.mkr.craft.models.Binding
import pw.mkr.craft.models.Chunk
import pw.mkr.craft.blocks.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object ServerInit : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()

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

                player.server ?: return true

                val serverPlayer = player as ServerPlayerEntity
                val playerGameMode = serverPlayer.interactionManager.gameMode

                val isPlayerSurvival = playerGameMode == GameMode.SURVIVAL
                val isPlayerAdventure = playerGameMode == GameMode.ADVENTURE

                // player went inside a bound chunk
                if ((oldBinding == null && newBinding != null) || oldBinding == newBinding) {
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
