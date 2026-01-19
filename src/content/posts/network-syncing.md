---
title: 'Perception Network Syncing: Trials and Tribulations'
author: Reng Zheng
date: '10-01-2025'
image:
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/IEEE1588_1.jpg'
    alt: 'IEEE-1588 (PTP) time-syncing diagram.'
---
# Background
description: 'Sensor syncing for an autonomous vehicle systems.'
platform: Jetpack OS 6.0.1
stack: IEEE-1588, Ouster OS1-128

# Importance of Sensor Syncing
Sensor syncing, especially for perception systems, is important because the natural world is structureless, except for moments in time. Each moment in time, in a given inertial frame, contains all the information possible to extrapolate what happens before, and what happens after. In other words, time is the natural way to splice the universe [^1].

If your sensors are temporally out of sync[^2], then, you have destroyed a well-defined, fine-grain structure of your data. This destruction destroys the usefulness of your data, as now your information of where something is at $$t$$ is actually a smear of where that something is at some $$t$$ from $$t_0 \leq t \leq t_f$$, where $$t_0, t_f$$ are your first and final sensor inputs respectively.

Now, this is not a problem if your frame is stationary and your object is stationary for $$x(t_0) == x(t_f) == x_(t)$$ because $$\dot{x}(t) = 0 \forall t$$. But, this perception system is for a race car. Race cars generally should move, and should move fast. Thus, the "smear" across your sensors is defined by an uncertainty interval $$\Delta x = x(t_f) - x(t_0) = \bar{v}_{[t_0, t_f]} \times (t_f - t_0)$$. This means, worst case, if we coast at our top speed of $$\bar{v}_{[t_0, t_f]} 80 \text{km/h}$$, with a smear across our minimal sensor's data collection frequency of 10 Hz, we have $$\Delta x(1/10 \text{Hz}) = 100 \text{ms} \times 22.(2) \text{m/s} = 2.(2) \text{m}$$.

This is an unacceptable level of time desync for a road vehicle to miss the length of a basketball player laying down, so let's go to how we get better.

# Doing Better than Worst-Case
## The Stack
The importance of any time syncing solution you will look into "getting better." So, in brief, here's our stack and the hyperlinks to the relevant SKUs:

1. [Ouster OS1-128](https://ouster.com/insights/blog/introducing-the-os-1-128-lidar-sensor)
2. [Blackfly S GigE: 3.2 MP, Color, C-mount](https://www.teledynevisionsolutions.com/en-au/products/blackfly-s-gige/?model=BFS-PGE-31S4C-C)
3. [Blackfly S GigE: 1.6 MP, Color, CS-mount](https://www.teledynevisionsolutions.com/products/blackfly-s-gige/?model=BFS-PGE-16S2C-CS&vertical=machine%20vision&segment=iis)

## The Solutions
Great, now that you have that, you could've read through all the documentation, thought out all the methods to sync the sensors, and arrived at some practical method to reduce $$\Delta t$$, which realistically should not be hard as 100ms delay is really bad! Instead, though, I have done that for you below (as I already had to do it):

There's two ways to approach syncing with our stack: LIDAR-triggered output synchronization, or clock synchronization. You may propose compute or clock-triggered output synchronization, but this is not possible, as our LIDAR's external syncing mechanism syncs *only* the rotation of the LIDAR and/or the internal clock, but never when the point-cloud is sent. We therefore will only litigate the two viable of the three hypothetical classes of syncing below:

1. [Lidar Triggered Sync](https://data.ouster.io/downloads/hardware-user-manual/hardware-user-manual-rev06-os1.pdf)
   - About: The LIDAR can be set to trigger a `SYNC_OUT` command at a certain point in its rotation. This allows us to slave all other devices, from cameras to the data-collating device (your compute), to the rising edge of the LIDAR output sync. Drawbacks of this implementation, however, is this guarantees drift from the cameras as there is a delay of $$t_f = t_\text{SYNC\_OUT} + t_\text{CAMERA\_EXPOSURE} + T_\text{transmission}$$. Upside is it's pretty simple since your  is your LIDAR.
   - Pros:
     - Easy to measure: oscilloscope on wire tells you if the sync is working, at what rate, and with what latency.
     - Easy to implement: you change the `LINE_2` and `EXPOSURE_EVENT_TRIGGER` settings to `hardware_trigger` on all 3 cameras, and set the ouster to `SYNC_OUT` at some azimuth, as passed to the driver via a launch file.
   - Cons:
     - Post-processing for timestamps: the outputs are synced, but the timestamps are not rectified live, as the clocks are never synced from [epoch](https://en.wikipedia.org/wiki/Epoch_(computing)#Notable_epoch_dates_in_computing) on startup.
2. [Clock Synchronization](https://standards.ieee.org/ieee/1588/4355/)
   - About: The sensors have internal clocks that stamp the data with the time they are taken. These clocks are set to unity time from the start, or if they are synced, are usually synced with some margin-of-error acceptable to non-automotive uses (e.g., security CV, factory QA). If we manage to sync these clocks with IEEE-1588 (i.e, Precision-Time-Protocol (PTP)), 

# Implementation
The option that is ideal 

# Golfed
## Background
Because perception's i/o is large-data, ROS-networked, and capture independently of each other, sensor outputs may be out-of-order, delayed, or dropped. These errors pose problems to 3D reconstruction algorithms (like BevFusion), as two sensor readings about the position of one object many seconds apart is garbage correlation, which means garbage 3D reconstruction. Sensor syncing solves this.

## Solution
The solution is a two-parter. First, we introduce a way of rectifying the data without manual intervention: PTP syncing. This syncs the clocks of all our sensors to millisecond-level accuracy, so we can reconstruct the ordering of the data.

The second part is a hardware trigger. Ideally, a main clock sends out a signal to the sensors to capture data and measures the response time to determine delays. We can't do this because of LIDAR limitations. However, we can use the LIDAR to signal the cameras to capture, and to tell the Orin that it has done this, which is acceptable. This means the data will arrive in order and taken temporally near each other.

## Analysis
Hardware triggers can solve data arriving at different times without PTP, but this requires aligning the un-synced timestamps at some point for downstream use. PTP can also solve the issue alone if you have lax tolerances, as you can group closely timed captures together as "approximately" the same time. However, both are necessary if the timing solution must be well-correlated, like on a car

[^1]: See also: causality obeys a partial ordering of spacetime, but because of the dimensionality of the universe we exist in, time is the dominant domain controlling causality and thus the ordering of events leading to other events.
[^2]: I will shorten this naturally to just "sync".