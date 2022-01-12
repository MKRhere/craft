package pw.mkr.craft

import net.fabricmc.api.ClientModInitializer
import pw.mkr.craft.blocks.binding.BindingBlock
import pw.mkr.craft.blocks.portals.PortalBlock

@Suppress("Unused")
object Init : ClientModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeClient() {
        BindingBlock.register()
        PortalBlock.register()
    }
}
