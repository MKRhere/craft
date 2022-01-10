package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.text.LiteralText
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.events.chunkentry.ChunkEntryEvent
import pw.mkr.craft.events.chunkentry.ChunkEntryListener
import pw.mkr.craft.models.Chunk
import pw.mkr.craft.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object Init : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()

        ChunkEntryEvent.listen(object: ChunkEntryListener {
            override fun onChunkEntry(player: PlayerEntity, oldChunk: Chunk, newChunk: Chunk): Boolean {
                player.sendMessage(LiteralText("Welcome to the chunk ${newChunk}!"), false)
                return true
            }
        })
    }
}
