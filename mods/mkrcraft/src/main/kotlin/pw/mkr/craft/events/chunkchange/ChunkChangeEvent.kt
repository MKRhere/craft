package pw.mkr.craft.events.chunkchange

import net.minecraft.entity.player.PlayerEntity
import net.minecraft.util.math.ChunkPos
import pw.mkr.craft.models.Chunk

private val listeners: MutableList<ChunkChangeListener> = mutableListOf()

interface ChunkChangeListener {
    // return true if you want to keep receiving future updates
    fun onChunkChange(pos: Chunk, player: PlayerEntity): Boolean
}

object ChunkChangeEvent {
    fun listen(listener: ChunkChangeListener) {
        listeners += listener
    }

    @Synchronized
    fun broadcast(pos: Chunk, player: PlayerEntity) {
        val listenerIterator = listeners.iterator()

        while (listenerIterator.hasNext()) {
            val listener = listenerIterator.next()

            if (!listener.onChunkChange(pos, player)) listenerIterator.remove()
        }
    }
}