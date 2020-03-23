---
layout: post
title:  "on how to design a tracing algorithm for drone graffiti art"
date:   2020-03-22 12:00:00 +0100
categories: [article]
tags: [svg, trace, drone, blockchain, algorithm, javascript, image]
thumbnail: /assets/posts/thumbnails/drone_paint_thumbnail.jpg
author: "Nuño de la Serna"
---
#### prologue

In winter 2018-2019 I worked together with [THE WYE][wye-website] agency and [eæternity][ae-website] on a [blockchain drone graffiti][drone-website] project. My task on the project was to find a solution and to develop a javascript tool that transforms images from the blockchain into optimized flyable paths for drones.

The project specifics limited the output designs to one single color with a constant stroke weight and a set of maximum sizes and resolution. Due to the limited accuracy/resolution of the drones, the battery capacity and the cost of flight time, the software design focused on extracting the relevant information from the images and minimizing the drawing time, maintaining a faithful abstraction to the original image.

----

#### research

First of all we, need to decide how are those digital images going to be physically interpreted and painted by the drones.

![Image source Berlin Fernsehturm](/assets/posts/img/action-io_tvtower_m.jpg){:class="img-col-4"}![halftone image](/assets/posts/img/tvtower_halftone.jpg){:class="img-col-4"}![Rastered image](/assets/posts/img/tvtower_raster.jpg){:class="img-col-4"}


Halftone and Stippling techniques are based on the constitution of sets and patterns that, through repetition, create textures and silhouettes. A low resolution stippling would result into a non defined shape.

During the first steps of the research process, it became clear that abstraction was key. The paintings need to represent the essential parts of the images with the minimum amount of wall space and paint.<br>

<br/><br/>

**Extracting data by Edge Detection**

Extracting relevant information from images to draw outlines and contours, using edge
detection techniques may be a good idea.
Most edge detection techniques produce a blurred image where areas with higher height
contrast are shown with a gray scale or a color code corresponding to the direction of the
edge.

![Edge detection Sobel Feldman](/assets/posts/img/tvtower_halftone_Sobel-Feldman.jpg){:class="img-col-6"}![Edge detection Roberts Cross](/assets/posts/img/tvtower_halftone_Roberts_cross.jpg){:class="img-col-6"}

Even after applying common filtering techniques, as `Sigmoid` or `Bilateral filter`, the lines are still not perfectly define and the edges are blurry. Common approaches like the `Sobel Feldman` operator produces a blurry result. After filtering, the edges will become a blob that does not describe the borders in terms of data.

<br/><br/>

**SVG Tracing approach**

Standar svg tracing algorithms follow the same steps for converting common color areas into
vector shapes. The standard image tracing algorithms, trace the outline borders of color blobs.


![Traced photo](/assets/posts/img/tracing_lepard.jpg){:class="img-col-6"}![Traced illustration](/assets/posts/img/tracing_illustration.jpg){:class="img-col-6"}

When this technique is applied to photographs, results into a bunch of dots and disjointed shapes. On illustrations and text, svg tracing will produce a double outline that describes the contour of the image lines (blob). Making the drone passing twice the same path.

<br/><br/>

**centerline**

Techniques like `Morphological Skeleton` or `Thinning` are operations that are used to remove selected foreground pixels from binary images, reducing a blob width a single weight pixel line and can be used to find the trace that forms a stroke.

![potrace centerline](/assets/posts/img/centerline-trace-poster.jpg){:class="img-col-6"}![morphological skeleton illustration](/assets/posts/img/illustration_thinning.jpg){:class="img-col-6"}

The issue with this techniques, is that the methods will perform on all the image and can not differentiate from strokes or actual shapes. On the cases that the shape width is bigger than the output stroke, the result will not correlate with the original image.

![I love Berlin](/assets/posts/img/loveber.jpg){:class="img-col-6"}![morphological skeleton](/assets/posts/img/loveber_skeleton.jpg){:class="img-col-6"}

<br/><br/>

**Abstraction by Canny Edge Detector**

Canny is a great technique to obtain a filtered edge detection.
The canny approach uses several techniques of filtering and post processing for cleaning and reduces drastically the amount of information, leaving a single pixel border. When parameters are adjusted correctly, an elementary version of the shapes, can be obtain.

![Leopard canny edge detection](/assets/posts/img/leopard_cany.jpg){:class="img-col-6"}![Fernsehturm canny edge detection](/assets/posts/img/tower_cany.jpg){:class="img-col-6"}

This lines are a good abstraction of the complexity of the image.

---

#### implementation

Illustrations and text requires another kind of preprocessing and filtering. Any tracing or edge detection technique applied over this kind of images will produce a double outline that describes the contour of the image lines.

Morphological Skeleton will create a single-pixel line, but will damage the silhouette of bigger shapes and contours.
To solve this obstacle I implemented a combination of operations, using [Dilation](https://en.wikipedia.org/wiki/Dilation_(morphology)) and the [Zhang Suen](https://rosettacode.org/wiki/Zhang-Suen_thinning_algorithm) thinning, that will convert the large shapes into outlines and keep the fine lines as they are. *The threshold of this thickness is set at the diameter of the drone's painting diameter.*


| Edge detection          | Dilation                | Screen (Dilation /-/ threshold) | Zhang-Suen Thinning     |
| ----------------------- | ----------------------- | ------------------------------- | ----------------------- |
| ![thinning][thinning-1] | ![thinning][thinning-2] | ![thinning][thinning-3]         | ![thinning][thinning-4] |

[thinning-1]: /assets/posts/img/thinning_01.jpg
[thinning-2]: /assets/posts/img/thinning_02.jpg
[thinning-3]: /assets/posts/img/thinning_03.jpg
[thinning-4]: /assets/posts/img/thinning_04.jpg


The process of [Canny Edge Detection](https://en.wikipedia.org/wiki/Canny_edge_detector) algorithm can be broken down to this steps.
- Gaussian filter
- Gradients (magnitude [x,y])
- Nonmaximum supression
- Hysterysis

The implementing `Canny Edge Detection` was done step by step, tweak the operations and optimizing the performance to get the best results. [StackBlur](https://github.com/flozz/StackBlur) was used for a *fast* `Gaussian Blur` operation.

This approach allows the tool, by applying different kernels and thresholds, to extract more or less detail from the image while maintaining meaning.



| Gaussian filter                      | Gradients                            | n-m supression                       | Hysterysis                           |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| ![canny edge detection A1][c-e-d-A1] | ![canny edge detection A2][c-e-d-A2] | ![canny edge detection A3][c-e-d-A3] | ![canny edge detection A4][c-e-d-A4] |
| ![canny edge detection B1][c-e-d-B1] | ![canny edge detection B2][c-e-d-B2] | ![canny edge detection B3][c-e-d-B3] | ![canny edge detection B4][c-e-d-b4] |

[c-e-d-A1]: /assets/posts/img/canny_edge_astronaut_A_01.jpg
[c-e-d-A2]: /assets/posts/img/canny_edge_astronaut_A_02.jpg
[c-e-d-A3]: /assets/posts/img/canny_edge_astronaut_A_03.jpg
[c-e-d-A4]: /assets/posts/img/canny_edge_astronaut_A_04.jpg

[c-e-d-B1]: /assets/posts/img/canny_edge_astronaut_B_01.jpg
[c-e-d-B2]: /assets/posts/img/canny_edge_astronaut_B_02.jpg
[c-e-d-B3]: /assets/posts/img/canny_edge_astronaut_B_03.jpg
[c-e-d-B4]: /assets/posts/img/canny_edge_astronaut_B_04.jpg


In the conventional way of converting bitmaps to vectors, the tracing operation breaks down into the following steps.

*`color quantification` > `layering` > `path scan` > `inter nodes` > `batch trace paths`*

Since the tool is designed to work only with one color and the previous operations are based on binary maps, the `color quantification` is not needed and instead, the result matrix from previous operations is injected into the tracing pipeline.

Based on [imagetracerjs](https://github.com/jankovicsandras/imagetracerjs) edge node logic and combining [autotrace](https://github.com/autotrace/autotrace) `centerline` approach and [contrast path finding](/works/memory-trace-map-of-berlin.html), the tool traces individual lines as paths rather than closed shapes.

To generate realistic trajectories that can be reproduced by the drones, the resulting vector paths are filtered to meet the limitations of accuracy, angle precision and minimum distances.

![Astronaut Photography](/assets/posts/img/Astronaut-EVA_md.jpg){:class="img-col-6"}![drone paint svg](/assets/posts/img/dtraced_astronaut.jpg){:class="img-col-6"}![I love Berlin illustration](/assets/posts/img/loveber.jpg){:class="img-col-6 img-clear"}![drone paint svg](/assets/posts/img/dtraced_loveber.jpg){:class="img-col-6"}

The code of project was published under the MIT License and you can find it at the [Drone-Graffiti][github] github page.

Find images of graffitis made with [@drone_graffiti][instagram] at instagram and the [drone graffiti][drone-website] project website.

[ae-website]: https://aeternity.com/
[wye-website]: http://thewye.de/
[drone-website]: https://www.dronegraffiti.com/
[github]: https://github.com/Drone-Graffiti/DroneTracer
[instagram]: https://www.instagram.com/drone_graffiti/
