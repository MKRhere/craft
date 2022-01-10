package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.text.LiteralText
import net.minecraft.util.math.ChunkPos
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.events.chunkentry.ChunkChangeEvent
import pw.mkr.craft.events.chunkentry.ChunkChangeListener
import pw.mkr.craft.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object Init : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()

        ChunkChangeEvent.listen(object: ChunkChangeListener {
            override fun onChunkChange(pos: ChunkPos, player: PlayerEntity): Boolean {
                player.sendMessage(LiteralText("Welcome to the chunk ${pos}!"), false)
                return true
            }
        })
    }
}
