package pw.mkr.craft.mixins;

import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.util.math.ChunkPos;
import net.minecraft.util.math.Vec3d;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import pw.mkr.craft.events.chunkentry.ChunkEntryProcessor;
import pw.mkr.craft.models.Chunk;

@Mixin(PlayerEntity.class)
public class PlayerEntityMixin {
    @Inject(at = @At(value = "INVOKE", target = "Lnet/minecraft/entity/LivingEntity;travel(Lnet/minecraft/util/math/Vec3d;)V"), method = "travel")
    private void onTravel(Vec3d movementInput, CallbackInfo ci) {
        PlayerEntity player = (PlayerEntity) (Object) this;
        ChunkPos chunk = player.getChunkPos();
        ChunkEntryProcessor.INSTANCE.chunkEvent(new Chunk(chunk.x, chunk.z), player);
    }
}
