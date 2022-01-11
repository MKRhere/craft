package pw.mkr.craft

import net.fabricmc.api.ClientModInitializer
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object Init : ClientModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeClient() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()
    }
}
