package pw.mkr.craft

import net.fabricmc.api.ModInitializer
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.portals.PortalBlock

@Suppress("Unused")
object Init : ModInitializer {
    private const val MOD_ID = "mkrcraft"

    override fun onInitialize() {
        BindingBlock.register()
        PortalBlock.register()
    }
}
