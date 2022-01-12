package pw.mkr.craft.models

import net.minecraft.util.math.BlockPos

data class Coords(val x: Int, val y: Int, val z: Int)

fun BlockPos.toModel() = Coords(x, y, z)
