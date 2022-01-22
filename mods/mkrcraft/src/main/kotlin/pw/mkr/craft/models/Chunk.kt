package pw.mkr.craft.models

import net.minecraft.util.math.ChunkPos

data class Chunk(val x: Int, val z: Int) {
    override fun equals(other: Any?) = other is Chunk && (other.x == x && other.z == z)
    override fun toString() = "[$x, $z]"

    fun isInRadius(other: Chunk, radius: Int): Boolean {
        val xInRange = other.x >= (x - radius) && other.x <= (x + radius)
        val zInRange = other.z >= (z - radius) && other.z <= (z + radius)

        return xInRange && zInRange
    }
}

fun ChunkPos.toModel() = Chunk(x, z)