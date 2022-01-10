package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.world.GameMode
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.events.chunkentry.ChunkEntryEvent
import pw.mkr.craft.events.chunkentry.ChunkEntryListener
import pw.mkr.craft.models.Chunk
import pw.mkr.craft.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object Init : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"
    private val cachedGameModes: HashMap<String, GameMode> = hashMapOf()

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()

        ChunkEntryEvent.listen(object : ChunkEntryListener {
            override fun onChunkEntry(player: PlayerEntity, oldChunk: Chunk, newChunk: Chunk): Boolean {
                val oldBinding = StoreManager.chunkBoundTo(oldChunk)
                val newBinding = StoreManager.chunkBoundTo(newChunk)

                player.server ?: return true

                val serverPlayer = player as ServerPlayerEntity

                // player went inside a bound chunk
                if (oldBinding == null && newBinding != null) {
                    serverPlayer.changeGameMode(GameMode.ADVENTURE)
                    cachedGameModes[player.uuidAsString] = serverPlayer.interactionManager.gameMode
                }

                // player went out of a bound chunk
                if (oldBinding != null && newBinding == null) {
                    cachedGameModes[player.uuidAsString].also {
                        it ?: return@also
                        serverPlayer.changeGameMode(it)
                        cachedGameModes.remove(player.uuidAsString)
                    }
                }

                return true
            }
        })
    }
}
