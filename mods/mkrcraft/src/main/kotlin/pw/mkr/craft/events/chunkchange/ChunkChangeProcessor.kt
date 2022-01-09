package pw.mkr.craft.events.chunkchange

import net.minecraft.entity.player.PlayerEntity
import net.minecraft.util.math.ChunkPos

/***
 * Observes a constant stream of chunk status and broadcasts
 * a chunk change event when it detects a change
 */
object ChunkChangeProcessor {
    private val playerChunks: HashMap<String, ChunkPos> = hashMapOf()

    fun chunkEvent(newChunkPos: ChunkPos, player: PlayerEntity) {
        val playerName = player.name.toString()
        var playerChunkPos = playerChunks[playerName]

        // if player doesn't exist in hashmap, add them and proceed with the check
        if (playerChunkPos == null) {
            playerChunks[playerName] = newChunkPos
            playerChunkPos = newChunkPos
        }

        // if new chunk matches previous chunk, set previous chunk
        // to new chunk, and broadcast this chunk change as an event
        if (playerChunkPos != newChunkPos) {
            playerChunks[playerName] = newChunkPos
            ChunkChangeEvent.broadcast(newChunkPos, player)
        }
    }
}