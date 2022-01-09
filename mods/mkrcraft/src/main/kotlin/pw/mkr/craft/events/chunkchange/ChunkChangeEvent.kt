package pw.mkr.craft.events.chunkchange

import net.minecraft.entity.player.PlayerEntity
import net.minecraft.util.math.ChunkPos
import pw.mkr.craft.utils.Player

private val listeners: MutableList<ChunkChangeListener> = mutableListOf()

interface ChunkChangeListener {
    fun onChunkChange(pos: ChunkPos, player: PlayerEntity)
    fun unregister() {
        listeners -= this@ChunkChangeListener
    }
}

object ChunkChangeEvent {
    fun listen(listener: ChunkChangeListener) {
        listeners += listener
    }

    fun broadcast(pos: ChunkPos, player: PlayerEntity) {
        for (listener in listeners) {
            listener.onChunkChange(pos, player)
        }
    }
}