package pw.mkr.craft.blocks.binding

import net.fabricmc.fabric.api.`object`.builder.v1.block.FabricBlockSettings
import net.fabricmc.fabric.api.item.v1.FabricItemSettings
import net.minecraft.block.Block
import net.minecraft.block.BlockState
import net.minecraft.block.Material
import net.minecraft.block.entity.BlockEntity
import net.minecraft.entity.LivingEntity
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.item.BlockItem
import net.minecraft.item.ItemGroup
import net.minecraft.item.ItemStack
import net.minecraft.text.LiteralText
import net.minecraft.util.Identifier
import net.minecraft.util.math.BlockPos
import net.minecraft.util.math.ChunkPos
import net.minecraft.util.registry.Registry
import net.minecraft.world.World
import net.minecraft.world.event.GameEvent
import pw.mkr.craft.models.Binding
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
            if (placer != null && world != null && pos != null) {
                fun sendMessage(msg: String) = placer.sendSystemMessage(LiteralText(msg), placer.uuid)

                val blockChunk = ChunkPos(pos).toModel()

                // check if a binding exists
                val existingBinding = StoreManager.chunkBoundTo(blockChunk)
                if (existingBinding != null) {
                    world.breakBlock(pos, true, placer)
                    return sendMessage("This chunk has already been claimed by ${existingBinding.player}")
                }

                val binding = StoreManager.addBinding(Binding(blockChunk, placer.name.asString()))

                binding ?: return sendMessage("Failed to claim binding")

                sendMessage("You have claimed ${binding.claimRadius} chunks around $blockChunk")
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
            val bindingBlock =
                BindingBlock(
                    FabricBlockSettings.of(Material.METAL).strength(4.0f).requiresTool()
                )
            val bindingItem = BlockItem(bindingBlock, FabricItemSettings().group(ItemGroup.MISC))

            Registry.register(Registry.BLOCK, Identifier("mkrcraft", "binding_block"), bindingBlock)
            Registry.register(Registry.ITEM, Identifier("mkrcraft", "binding_block"), bindingItem)
        }
    }
}
