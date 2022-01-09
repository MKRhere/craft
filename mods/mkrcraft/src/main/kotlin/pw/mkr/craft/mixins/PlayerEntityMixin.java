package pw.mkr.craft.mixins;

import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.util.math.Vec3d;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import pw.mkr.craft.events.chunkchange.ChunkChangeProcessor;
import pw.mkr.craft.utils.Player;

@Mixin(PlayerEntity.class)
public class PlayerEntityMixin {
    @Inject(at = @At(value = "INVOKE", target = "Lnet/minecraft/entity/LivingEntity;travel(Lnet/minecraft/util/math/Vec3d;)V"), method = "travel", cancellable = true)
    private void onTravel(Vec3d movementInput, CallbackInfo ci) {
        PlayerEntity player = (PlayerEntity) (Object) this;
        ChunkChangeProcessor.INSTANCE.chunkEvent(player.getChunkPos(), player);
    }
}
