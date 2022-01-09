package pw.mkr.craft.utils

import com.google.gson.GsonBuilder
import net.fabricmc.loader.api.FabricLoader
import pw.mkr.craft.Init
import java.io.File

object StoreManager {
    private val gson = GsonBuilder().setPrettyPrinting().create()
    private lateinit var store: Store

    private val storeFile =
        File(
            FabricLoader.getInstance().gameDir.toFile(),
            "${Init.MOD_ID}-store.json"
        )

    private fun doesBindingExist(binding: Binding) =
        store.placedBindings.find { it == binding } != null

    fun init() =
        if (!storeFile.exists()) {
            Init.logger.info("Store not found, creating one at $storeFile")
            store = Store(mutableListOf())
            saveToDisk()
        } else {
            Init.logger.info("Using existing store at $storeFile")
            store = gson.fromJson(storeFile.readText(), Store::class.java)
        }

    fun addBinding(binding: Binding) {
        if (doesBindingExist(binding)) {
            Init.logger.warn("Binding $binding already exists, skipping")
            return
        }

        store.placedBindings += binding
    }

    fun removeBinding(binding: Binding) {
        if (doesBindingExist(binding)) store.placedBindings -= binding
        else Init.logger.warn("Binding $binding doesn't exist, unable to remove")
    }

    fun saveToDisk() = storeFile.writeText(gson.toJson(store))
}
