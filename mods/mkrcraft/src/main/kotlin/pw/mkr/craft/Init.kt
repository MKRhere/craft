package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import org.apache.logging.log4j.LogManager
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object Init : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"
    val logger = LogManager.getLogger()!!

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()
    }
}
