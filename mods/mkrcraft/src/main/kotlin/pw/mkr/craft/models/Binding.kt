package pw.mkr.craft.models

data class Binding(
    val chunk: Chunk,
    val coords: Coords,
    val title: String?,
    val player: String,
    val claimRadius: Int = 1
)
