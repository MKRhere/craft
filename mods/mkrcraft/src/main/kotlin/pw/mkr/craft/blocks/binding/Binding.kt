package pw.mkr.craft.blocks.binding

import net.fabricmc.fabric.api.item.v1.FabricItemSettings
import net.fabricmc.fabric.api.`object`.builder.v1.block.FabricBlockSettings
import net.minecraft.block.Block
import net.minecraft.block.BlockState
import net.minecraft.block.Material
import net.minecraft.entity.LivingEntity
import net.minecraft.item.*
import net.minecraft.text.LiteralText
import net.minecraft.util.Identifier
import net.minecraft.util.math.BlockPos
import net.minecraft.util.math.ChunkPos
import net.minecraft.util.registry.Registry
import net.minecraft.world.World
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
        // TODO(mkr): logic to validate binding on placement
        if (Utils.isServer) {
            if (placer != null) {
                fun sendMessage(msg: String) = placer.sendSystemMessage(LiteralText(msg), placer.uuid)

                val blockChunk = ChunkPos(pos).toModel()
                val binding = StoreManager.addBinding(Binding(blockChunk, placer.name.asString()))

                binding ?: return sendMessage("Failed to claim binding")

                sendMessage("You have claimed ${binding.claimRadius} chunks around $blockChunk")
            } else Utils.logger.error("Binding block placed by unknown entity!")
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
