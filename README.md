|    章节    |            小节            |                             概述                             |                  ps                  |
| :--------: | :------------------------: | :----------------------------------------------------------: | :----------------------------------: |
|  FirstTry  |         FirstDemo          |                         初始绘制场景                         |                                      |
|  FirstTry  |       FirstDrawLine        |      LineBasicMaterial；BufferGeometry.setFromPoints；       |                                      |
| chapter-01 |           Scene            |               初始化渲染场景-----AxesHelper；                |                                      |
| chapter-01 |           Lights           |               SpotLight；AmbientLight；Vector2               |                                      |
| chapter-01 |     :star: Animations      | Stats-js ;   castShadow ;   receiveShadow ;  dat.GUI ;   trackballControls ;   onResize ; THREE.Clock().getDelta() |                                      |
| chapter-02 |        SceneDetail         | scene.remove ;   scene.children.length ;   cube.name ;    planeGeometry.parameters.width ; scene.traverse :star:  ;    scene.fog ;   scene.overrideMaterial;   scene.getObjectByName |                                      |
| chapter-02 |      Geometry/custom       | 手动创建立方体：new three.geometry().computeFaceNormals ； geometry.clone() ;createMultiMaterialObject ； translateX |        Three.face3(125+弃用)         |
| chapter-02 |         MeshDetail         | mesh.position / rotation /scale /translateX /translateY /visible / cube.rotation.set(x, y, z) =cube.rotation = new THREE.Vector3(x,y,z) |                                      |
| chapter-02 |        CameraDeatil        | OrthographicCamera: 正交投影相机；PerspectiveCamera：透视投影相机 |                                      |
| chapter-03 |   AmbientLight (环境光)    | ambientLight.color / intensity / visible ; spotLight.color.getStyle() |  CubeGeometry(弃用) =>> BoxGeometry  |
| chapter-03 |     SpotLight (聚光灯)     | spotLight.lookAt = spotLight.target ; CameraHelper ； SpotLightHelper; |             可以产生阴影             |
| chapter-03 |    PointLight (点光源)     |     ⭐pointLight.position.copy(sphereLightMesh.position)      |             可以产生阴影             |
| chapter-03 | DirectionalLight（平行光） |                          onlyShadow                          |             可以产生阴影             |
| chapter-04 |     MeshBasicMaterial      |                      MeshBasicMaterial                       |                                      |
| chapter-04 |     MeshDepthMaterial      |                      MeshDepthMaterial                       |                                      |
| chapter-04 |          联合材质          | createMultiMaterialObject ； blending: THREE.MultiplyBlending ；camera.updateProjectionMatrix():star:相机更新需要调用 |                                      |
| chapter-04 |    MeshLambertMaterial     |    emisssive:无法被光源照射到的暗处显示的颜色，默认为黑色    |                 感光                 |
| chapter-04 |     MeshPhongMaterial      | material.emissive.getStyle()  ;  material.specular.getStyle() |                                      |
| chapter-04 |     LineBasicMaterial      |           new THREE.BufferGeometry().setFromPoints           | Geometry(126+弃用)改为BufferGeometry |
|            |                            |                                                              |                                      |
|            |                            |                                                              |                                      |
|            |                            |                                                              |                                      |
|            |                            |                                                              |                                      |
|            |                            |                                                              |                                      |


