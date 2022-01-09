package pw.mkr.craft.events.chunkchange

import net.minecraft.entity.player.PlayerEntity
import net.minecraft.util.math.ChunkPos

private val listeners: MutableList<ChunkChangeListener> = mutableListOf()

interface ChunkChangeListener {
    // return true if you want to keep receiving future updates
    fun onChunkChange(pos: ChunkPos, player: PlayerEntity): Boolean
}

object ChunkChangeEvent {
    fun listen(listener: ChunkChangeListener) {
        listeners += listener
    }

    @Synchronized
    fun broadcast(pos: ChunkPos, player: PlayerEntity) {
        val listenerIterator = listeners.iterator()

        while (listenerIterator.hasNext()) {
            val listener = listenerIterator.next()

            if (!listener.onChunkChange(pos, player)) listenerIterator.remove()
        }
    }
}