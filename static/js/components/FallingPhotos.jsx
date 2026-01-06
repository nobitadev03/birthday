import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

function FallingPhotos() {
  const { camera, gl } = useThree();

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();

    const t1 = loader.load("/static/images/thuong1.jpg");
    const t2 = loader.load("/static/images/thuong2.jpg");

    [t1, t2].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = gl.capabilities.getMaxAnisotropy();
      t.needsUpdate = true;
    });

    return [t1, t2];
  }, [gl]);

  const groupRef = useRef();
  const timerRef = useRef(0);

  const spawn = () => {
    if (!groupRef.current) return;

    const tex = textures[Math.floor(Math.random() * textures.length)];

    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const sp = new THREE.Sprite(mat);

    sp.position.set(
      THREE.MathUtils.randFloat(-6, 6),
      THREE.MathUtils.randFloat(6, 9),
      THREE.MathUtils.randFloat(-2, 2)
    );

    const size = THREE.MathUtils.randFloat(1.6, 2.3);
    sp.scale.set(size, size, 1);

    sp.userData.speed = THREE.MathUtils.randFloat(0.35, 0.6);
    sp.userData.spin = THREE.MathUtils.randFloat(-0.8, 0.8);
    sp.renderOrder = 9999;

    groupRef.current.add(sp);
  };

  useFrame((_, delta) => {
    timerRef.current += delta;
    if (timerRef.current > THREE.MathUtils.randFloat(1.0, 1.4)) {
      timerRef.current = 0;
      spawn();
    }

    const g = groupRef.current;
    if (!g) return;

    for (let i = g.children.length - 1; i >= 0; i--) {
      const sp = g.children[i];
      sp.position.y -= sp.userData.speed * delta;
      sp.material.rotation += sp.userData.spin * delta * 0.15;

      if (sp.position.y < -8) {
        sp.material.map?.dispose?.();
        sp.material.dispose();
        g.remove(sp);
      }
    }
  });

  return <group ref={groupRef} />;
}

export default FallingPhotos;
