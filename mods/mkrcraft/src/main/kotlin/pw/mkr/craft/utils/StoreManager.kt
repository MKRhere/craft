package pw.mkr.craft.utils

import com.google.gson.GsonBuilder
import net.fabricmc.loader.api.FabricLoader
import pw.mkr.craft.ClientInit
import pw.mkr.craft.models.Binding
import pw.mkr.craft.models.Chunk
import pw.mkr.craft.models.Store
import java.io.File

object StoreManager {
    private val gson = GsonBuilder().setPrettyPrinting().create()

    @get:Synchronized
    private lateinit var store: Store

    private val storeDir =
        FabricLoader.getInstance().gameDir.resolve(
            "world/${ClientInit.MOD_ID}/store"
        ).toFile()

    private val storeFile = File(storeDir, "bindings.json")

    private fun doesBindingExist(binding: Binding) =
        store.bindings.find { it == binding } != null

    fun init() =
        if (!storeFile.exists()) {
            Utils.logger.info("Store not found, creating one at $storeFile")
            storeDir.mkdirs()
            store = Store()
            saveToDisk()
        } else {
            Utils.logger.info("Using existing store at $storeFile")
            store = gson.fromJson(storeFile.readText(), Store::class.java)
        }

    fun addBinding(binding: Binding): Binding? {
        if (doesBindingExist(binding)) {
            Utils.logger.warn("Binding $binding already exists, skipping")
            return null
        }

        store.bindings += binding
        return binding
    }

    fun removeBinding(binding: Binding): Binding? {
        return if (doesBindingExist(binding)) {
            store.bindings -= binding
            binding
        }  else {
            Utils.logger.warn("Binding $binding doesn't exist, unable to remove")
            null
        }
    }

    fun totalBindingsOf(player: String) = store.bindings.filter { x -> x.player == player }.size

    fun chunkBoundTo(chunk: Chunk) = store.bindings.find { it.chunk.isInRadius(chunk, it.claimRadius) }

    fun saveToDisk() = storeFile.writeText(gson.toJson(store))
}
