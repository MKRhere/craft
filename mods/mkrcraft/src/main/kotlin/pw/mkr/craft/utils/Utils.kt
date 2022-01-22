package pw.mkr.craft.utils

import net.fabricmc.api.EnvType
import net.fabricmc.fabric.api.`object`.builder.v1.block.FabricBlockSettings
import net.fabricmc.fabric.api.item.v1.FabricItemSettings
import net.fabricmc.loader.api.FabricLoader
import net.minecraft.block.AbstractBlock
import net.minecraft.block.Block
import net.minecraft.block.Material
import net.minecraft.item.BlockItem
import net.minecraft.item.ItemGroup
import net.minecraft.util.Identifier
import net.minecraft.util.registry.Registry
import org.apache.logging.log4j.LogManager
import kotlin.reflect.KFunction1

object Utils {
	val isServer = FabricLoader.getInstance().environmentType == EnvType.SERVER
	val logger = LogManager.getLogger()!!

	const val DAY_MULTIPLIER = 1 / (20 * 60 * 60 * 24)

	fun registerBlock(
		blockConstructor: KFunction1<AbstractBlock.Settings, Block>,
		blockName: String,
		strength: Float,
		group: ItemGroup
	) {
		val block =
			blockConstructor(
				FabricBlockSettings.of(Material.METAL).strength(strength).requiresTool()
			)

		val blockItem = BlockItem(block, FabricItemSettings().group(group))

		Registry.register(Registry.BLOCK, Identifier("mkrcraft", blockName), block)
		Registry.register(Registry.ITEM, Identifier("mkrcraft", blockName), blockItem)
	}
}