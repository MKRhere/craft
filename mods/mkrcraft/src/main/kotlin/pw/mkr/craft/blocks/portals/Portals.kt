package pw.mkr.craft.blocks.portals

import net.fabricmc.fabric.api.`object`.builder.v1.block.FabricBlockSettings
import net.minecraft.block.Block
import net.minecraft.block.BlockState
import net.minecraft.block.Material
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.item.ItemGroup
import net.minecraft.text.LiteralText
import net.minecraft.util.ActionResult
import net.minecraft.util.Hand
import net.minecraft.util.hit.BlockHitResult
import net.minecraft.util.math.BlockPos
import net.minecraft.world.World
import pw.mkr.craft.utils.Utils

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
		fun register() =
			Utils.registerBlock(::PortalBlock, "portal_block", 10f, ItemGroup.TRANSPORTATION)
    }
}
