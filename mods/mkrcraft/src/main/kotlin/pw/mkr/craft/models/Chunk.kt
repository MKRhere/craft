package pw.mkr.craft.models

data class Chunk(val x: Int, val z: Int) {
    override fun equals(other: Any?) = other is Chunk && (other.x == x && other.z == z)
}
