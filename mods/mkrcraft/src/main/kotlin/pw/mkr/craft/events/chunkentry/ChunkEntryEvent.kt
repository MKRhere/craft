package pw.mkr.craft.events.chunkentry

import net.minecraft.entity.player.PlayerEntity
import pw.mkr.craft.models.Chunk

private val listeners: MutableList<ChunkEntryListener> = mutableListOf()

interface ChunkEntryListener {
    // return true if you want to keep receiving future updates
    fun onChunkEntry(pos: Chunk, player: PlayerEntity): Boolean
}

object ChunkEntryEvent {
    fun listen(listener: ChunkEntryListener) {
        listeners += listener
    }

    @Synchronized
    fun broadcast(pos: Chunk, player: PlayerEntity) {
        val listenerIterator = listeners.iterator()

        while (listenerIterator.hasNext()) {
            val listener = listenerIterator.next()

            if (!listener.onChunkEntry(pos, player)) listenerIterator.remove()
        }
    }
}