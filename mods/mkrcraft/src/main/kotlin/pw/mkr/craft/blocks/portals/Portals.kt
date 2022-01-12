package pw.mkr.craft.blocks.portals

import net.fabricmc.fabric.api.item.v1.FabricItemSettings
import net.fabricmc.fabric.api.`object`.builder.v1.block.FabricBlockSettings
import net.minecraft.block.Block
import net.minecraft.block.BlockState
import net.minecraft.block.Material
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.item.BlockItem
import net.minecraft.item.ItemGroup
import net.minecraft.text.LiteralText
import net.minecraft.util.ActionResult
import net.minecraft.util.Hand
import net.minecraft.util.Identifier
import net.minecraft.util.hit.BlockHitResult
import net.minecraft.util.math.BlockPos
import net.minecraft.util.registry.Registry
import net.minecraft.world.World

class PortalBlock(settings: Settings) : Block(settings) {
    override fun onUse(
            state: BlockState,
            world: World,
            pos: BlockPos,
            player: PlayerEntity,
            hand: Hand,
            hit: BlockHitResult
    ): ActionResult {
        player.sendMessage(LiteralText("Hello, ${player.name}!"), false)
        return ActionResult.SUCCESS
    }
    companion object {
        fun register() {
            val portalBlock =
                    PortalBlock(
                            FabricBlockSettings.of(Material.METAL).strength(10.0f).requiresTool()
                    )
            val portalItem =
                    BlockItem(portalBlock, FabricItemSettings().group(ItemGroup.TRANSPORTATION))

            Registry.register(Registry.BLOCK, Identifier("mkrcraft", "portal_block"), portalBlock)
            Registry.register(Registry.ITEM, Identifier("mkrcraft", "portal_block"), portalItem)
        }
    }
}
