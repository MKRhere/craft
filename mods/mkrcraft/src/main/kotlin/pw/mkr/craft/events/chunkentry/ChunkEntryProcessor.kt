package pw.mkr.craft.events.chunkentry

import net.minecraft.entity.player.PlayerEntity
import pw.mkr.craft.models.Chunk

/***
 * Observes a constant stream of chunk status and broadcasts
 * a chunk change event when it detects a change
 */
object ChunkEntryProcessor {
    private val playerChunks: HashMap<String, Chunk> = hashMapOf()

    fun chunkEvent(newChunk: Chunk, player: PlayerEntity) {
        val playerName = player.name.toString()
        val oldChunk = playerChunks[playerName]

        // if player doesn't exist in hashmap, add them and broadcast
        if (oldChunk == null) {
            playerChunks[playerName] = newChunk
            // if player was not in hashmap, they were previously
            // in the same chunk that they are in right now
            return ChunkEntryEvent.broadcast(player, newChunk, newChunk)
        }

        // if new chunk matches previous chunk, set previous chunk
        // to new chunk, and broadcast this chunk change as an event
        if (oldChunk != newChunk) {
            playerChunks[playerName] = newChunk
            ChunkEntryEvent.broadcast(player, oldChunk, newChunk)
        }
    }
}