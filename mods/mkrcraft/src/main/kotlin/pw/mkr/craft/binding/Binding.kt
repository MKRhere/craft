package pw.mkr.craft.binding

import net.fabricmc.fabric.api.item.v1.FabricItemSettings
import net.fabricmc.fabric.api.`object`.builder.v1.block.FabricBlockSettings
import net.minecraft.block.Block
import net.minecraft.block.BlockState
import net.minecraft.block.Material
import net.minecraft.entity.LivingEntity
import net.minecraft.item.*
import net.minecraft.util.Identifier
import net.minecraft.util.math.BlockPos
import net.minecraft.util.registry.Registry
import net.minecraft.world.World

class BindingBlock(settings: Settings) : Block(settings) {
    override fun onPlaced(
            world: World?,
            pos: BlockPos?,
            state: BlockState?,
            placer: LivingEntity?,
            itemStack: ItemStack?
    ) {
        // TODO(mkr): logic to validate, handle/store binding on placement
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
