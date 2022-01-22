package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import pw.mkr.craft.blocks.binding.BindingBlock
import pw.mkr.craft.blocks.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object ServerInit : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()
    }
}
