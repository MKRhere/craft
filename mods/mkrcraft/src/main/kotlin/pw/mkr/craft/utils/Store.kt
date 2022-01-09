package pw.mkr.craft.utils

data class Player(val uuid: String, val name: String)

data class Binding(val x: Int, val y: Int, val z: Int, val player: Player)

class Store(val placedBindings: MutableList<Binding>)