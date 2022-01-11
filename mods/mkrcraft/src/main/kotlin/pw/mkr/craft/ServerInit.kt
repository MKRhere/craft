package pw.mkr.craft

import net.fabricmc.api.DedicatedServerModInitializer
import net.fabricmc.api.ModInitializer
import net.minecraft.entity.player.PlayerEntity
import net.minecraft.server.network.ServerPlayerEntity
import net.minecraft.text.LiteralText
import net.minecraft.world.GameMode
import pw.mkr.craft.binding.BindingBlock
import pw.mkr.craft.events.chunkentry.ChunkEntryEvent
import pw.mkr.craft.events.chunkentry.ChunkEntryListener
import pw.mkr.craft.models.Chunk
import pw.mkr.craft.portals.PortalBlock
import pw.mkr.craft.utils.StoreManager

@Suppress("Unused")
object ServerInit : DedicatedServerModInitializer {
    const val MOD_ID = "mkrcraft"

    override fun onInitializeServer() {
        StoreManager.init()
        BindingBlock.register()
        PortalBlock.register()

        ChunkEntryEvent.listen(object : ChunkEntryListener {
            override fun onChunkEntry(player: PlayerEntity, oldChunk: Chunk, newChunk: Chunk): Boolean {
                val oldBinding = StoreManager.chunkBoundTo(oldChunk)
                val newBinding = StoreManager.chunkBoundTo(newChunk)

                fun send(msg: String) = player.sendMessage(LiteralText(msg), false)

                player.server ?: return true

                val serverPlayer = player as ServerPlayerEntity

                // player went inside a bound chunk
                if (oldBinding == null && newBinding != null) {
                    if (serverPlayer.interactionManager.gameMode == GameMode.SURVIVAL) {
                        serverPlayer.changeGameMode(GameMode.ADVENTURE)
                        send("you've entered ${newBinding.player}'s claim")
                    }
                }

                // player went out of a bound chunk
                if (oldBinding != null && newBinding == null) {
                    if (serverPlayer.interactionManager.gameMode == GameMode.ADVENTURE) {
                        serverPlayer.changeGameMode(GameMode.SURVIVAL)
                        send("hope you had a good time in ${oldBinding.player}'s claim!")
                    }
                }

                return true
            }
        })
    }
}
