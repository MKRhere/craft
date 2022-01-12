package pw.mkr.craft.utils

import net.fabricmc.api.EnvType
import net.fabricmc.loader.api.FabricLoader
import org.apache.logging.log4j.LogManager

object Utils {
    val isServer = FabricLoader.getInstance().environmentType == EnvType.SERVER
    val logger = LogManager.getLogger()!!

    const val DAY_MULTIPLIER = 1  / (20 * 60 * 60 * 24)
}