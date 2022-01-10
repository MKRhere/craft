package pw.mkr.craft.events.chunkentry

import net.minecraft.entity.player.PlayerEntity
import pw.mkr.craft.models.Chunk

private val listeners: MutableList<ChunkEntryListener> = mutableListOf()

interface ChunkEntryListener {
    // return true if you want to keep receiving future updates
    fun onChunkEntry(player: PlayerEntity, oldChunk: Chunk, newChunk: Chunk): Boolean
}

object ChunkEntryEvent {
    fun listen(listener: ChunkEntryListener) {
        listeners += listener
    }

    @Synchronized
    fun broadcast(player: PlayerEntity, oldChunk: Chunk, newChunk: Chunk) {
        val listenerIterator = listeners.iterator()

        while (listenerIterator.hasNext()) {
            val listener = listenerIterator.next()

            if (!listener.onChunkEntry(player, oldChunk, newChunk)) listenerIterator.remove()
        }
    }
}