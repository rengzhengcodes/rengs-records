---
title: 'Perception Testing: My Thoughts on What Goes into a Testing Trip'
author: Reng Zheng
date: '10-03-2025'
image:
   url: '/fsae/perception/my25_right.png'
   alt: 'MY25 right-side view. Courtesy of the 2025 MIT Motorsporst Website (and, if memory serves, Eric Zhou who drew it).'
---
# Purpose
The purpose of this document is to detail the design decisions motivating a perception testing trip's procedures and what those procedures are. Procedures after the first are similar to the ones before, with changes bolded for easier identification. The reason for this formatting is so it is easily referenceable on a testing trip without the need to scroll.

If you're looking for *just the specific procedures*, go [here](/posts/perception-test-plans).

# Background
Bootstrapping an Autonomous Vehicle's Perception team is a hard task. For AMY25 at [MIT Motorsports](http://fsae.mit.edu) this means thinking about how you are going to collect training data after you've got your [sensors in order](./posts/network-syncing), with PTP (IEEE-1588) time-syncing.

<div class="center">
   <video class="pro-img" controls preload="metadata" playsinline style="width:100%; height:auto;">
      <source src="/fsae/perception/testing_trip.mp4" type="video/mp4" />
      Your browser does not support the video tag.
   </video>
   <p class="caption">Video of MY25 being tested. See more at <a href="https://fsae.mit.edu">fsae.mit.edu</a>.</p>
</div>

# What is a testing trip? What does it mean for Perception?
The philosophy of a testing trip is that you have some empirical unknown about the car that can only be [pragmatically] acquired by experimentation and data collection. For perception, this is determined by our project scope: accurate 3D reconstruction of objects in space. Therefore, there are 3 categories our testing trips can fall into:

1. Model training data collection.
2. Model live-demo.
3. Model integration.

## Model Training Data Collection
The first unknown ANY perception system will encounter are what are the sensor characteristics in the real world. Once you mount sensors to the car, you can have as much of your intrinsics, extrinsics, optical lens refraction, field of view et cetera all down on paper from CAD, but you never know what it actually looks like in the real world until the first time you turn them all on.

As we have found no better way of training humans/AI than large amounts of training data, these testing trips will likely comprise the majority of any autonomous testing cycle. They therefore have the most room to have fat trimmed, mostly in the areas of quality of data collection and effectiveness of the data collected. Thus, we will briefly discuss this before continuing.

### Data Collection Quality and Effectiveness
Your testing trip is only as good as the data you collect, so you better make damn sure that your data is correct. Testing time is also the most limited resource this team manufactures, because it is tied to the singular car we produce. Thus, here are the important things to fix when you data collect for perception:
1. Temporal Syncing
   1. The only fine-structure you have in your data is how it relates to each other in time. If I show you two images, even if you know they are from the same track and same location, the actual inferences you can draw from them are quite limited without knowing their temporal relation to each other.
2. Ground-Truth Data Collection
   1. Even if your data is temporally synced, it is still not sufficient to be called a good testing trip. This is because the accuracy of your inference off the data collected *from the car* is unvalidatable without a ground truth. Therefore, you *must* ensure your ground truth is as accurate as [pragmatically] possible. because there is *no* other way to well-validate your model if you do not have this.
3. Sensor Quality
   1. The first component of this is how good your sensors are. The higher spatiotemporal resolution you have on a sensor, the more accurate it is, and the more certainty we have that everything in the pipeline, from physical installation to data acquisition is done correctly, the better inferences you are able to make from the data, as it is more rich and more robust. Garbage-in Garbage-out as a corollary means your model is at least as garbage as how garbage your inputs are.
   2. The second component is how representative our sensors are to the actual conditions we are running in. If we run a sensor with a lens cap, that's an obvious failure, but a less obvious failure is a lens that is not screwed on tightly so the focal is wrong, or a lens with a dirt smear that is only seen later.

Thus, *before* collecting any autonomous data, the following should be validated so as not to waste people's time:
1. Ensure that you have temporally synced your sensors and that they are within the acceptable tolerances decided upon by that year's design requirements.
2. That you have taken the time to accurately collect your ground truth data and did not take short cuts or rushed it. Reverify if you have to, bad ground truths mean the testing trip has to be thrown out, so you wasted 1 testing trip's worth of time instead of the 30 minutes it takes to go around and recollect ground truth again.
3. Verify your sensor quality first by viewing the sensors live while the car is static, then reverifying that the sensors recorded correctly in dynamics in any subsequent break you have. The early you check dynamics the better, since the car could throw a silent error, have a loose wire, or any other things that would absolutely ruin a testing trip that can be caught by a simple spot check.

### Procedure
Now that we have established the high-level requirements of our testing trip, and the middle-level ways to deal with them, we can now write the procedure:
1. Determine the type of data you need to collect.
   1. For AMY25, this boils down to: accel, skidpad, or autocross.
2. Scout the proper testing location.
   1. Our tolerance of testing location is dependent on the data being representative of Michigan Motorspeedway *plus* the fact that the track is wide enough that should the car have an accident, there is sufficient space for EBS to engage.
3. Make packouts.
   1. This should be enough cones to make the track.
   2. The ground-truth data collection items.
      1. RTK+GNSS specifically for perception.
   3. The car being tested.
   4. The perception sensors.
   5. The perception computer.
      1. This includes the other computer(s) and parts necessary to interface off the car and store data if needed.
         1. For AMY 25 this is: the Orin, the small router, and a laptop that has X11 compatibility or a way to connect to a noVNC server on the Orin over LAN.
   6. A white balance reference.
   7. A camera able to shoot in raw without post white-balancing.
      1. Our on-car cameras techically can do this too.
4. Arrive at testing center
5. Set up
   1. This involves:
      1. Track Setup
         1. Placing the cones.
         2. Collecting ground-truth location data of the cones (and preferably color too).
         3. Collect a white-balance sample by capturing a photo on track conditions with all cones in frame and the white balance sample in frame.
      2. Enabling the perception stack
         1. Start the sensors recording.
         2. Verify they are recording correctly under static conditions.
            1. Verify time syncing and no obstructions of sensors.
         3. Verify that they recorded correctly under dynamic conditions after the first run (ideally, after the first trial).
6. Data collection
   1. Drive as many task-representative laps as possible. Make sure to take breaks to account for:
      1. Driver fatigue (if collecting data manually at different speeds).
      2. EBS-engager fatigue (if collecting data autonomously).
      3. Dynamic changes (e.g., sensor disconnecting, sensor becoming loose, running out of storage on the Orin).
      4. Getting enough start-stop procedures in.
         1. This is moreso important for trackdrive, where you have a slower mapping stage and a faster deadreckoning stage.
7. Pack up
   1. Make sure you have ground truths. If not, recollect them.
   2. Make sure data collected is saved.
   3. Turn off the Orin after data is saved and the sensors.
      1. Data $$\to$$ sensors in that order.
   4. Disconnect power from the Orin and sensors.
   5. Pick up cones.
   6. Pack vehicle.
8. Leave testing track
9. Arrive at Shop
10. Debrief
    1.  Note any incidentals for next time in Confluence *and* ping the RE for the system (Reng Zheng).
        1.  This includes any anomalies that might affect data collected. False positives preferrable over false negatives.
    2.  Take collected data off the car.
    3.  Ping dependents of the collected data that the data has arrived.
    4.  ENSURE that the data has been collected off the car, and delete data on the car as needed for space for the next testing trip.

## Model Live-Demo
Now that we've collected our training data, we need to test the model in live conditions to make sure we didn't forget anything. Thankfully, because we expect our training data to be representative of our actual live-performance, we can easily steal the philosophy and therefore procedures outlined above to create a new testing plan. Thus, you *ideally* only need to run this test once to ensure that your procedures for perception deployment are sound.

### Procedure
This yields the following modification, where bolded elements represent items that are new or have changed from the training data collection procedure.

1. Determine the type of **test** you need to run.
   1. For AMY25, this boils down to: accel, skidpad, or autocross.
2. Scout the proper testing location.
   1. Our tolerance of testing location is dependent on the data being representative of Michigan Motorspeedway *plus* the fact that the track is wide enough that should the car have an accident, there is sufficient space for EBS to engage. ***This should be the same location you did training in, unless you want to specifically test how the car handles at a track it has never seen before.* If you do not do this, you risk getting a run-ending out-of-distribution (OOD) error, and if you have improperly chosen a testing location, this means a potentially car-ending accident.**
3. Make packouts.
   1. This should be enough cones to make the track.
   2. The ground-truth data collection items.
      1. RTK+GNSS specifically for perception.
   3. The car being tested.
   4. The perception sensors.
   5. The perception computer.
      1. This includes the other computer(s) and parts necessary to interface off the car and store data if needed.
         1. For AMY 25 this is: the Orin, the small router, and a laptop that has X11 compatibility or a way to connect to a noVNC server on the Orin over LAN.
   6. A white balance reference.
   7. A camera able to shoot in raw without post white-balancing.
      1. Our on-car cameras techically can do this too.
   8. **These items are *ALL* still necessary because if something goes wrong, you want to not only make it in-distribution (ID) for your model, but also list all the factors that contributed to the error.**
4. Arrive at testing center
5. Set up
   1. This involves:
      1. Track Setup
         1. Placing the cones.
         2. Collecting ground-truth location data of the cones (and preferably color too).
         3. Collect a white-balance sample by capturing a photo on track conditions with all cones in frame and the white balance sample in frame.
      2. Enabling the perception stack
         1. Start the sensors recording.
         2. Verify they are recording correctly under static conditions.
            1. Verify time syncing and no obstructions of sensors.
         3. Verify that they recorded correctly under dynamic conditions after the first run (ideally, after the first trial).
      3. **Enabling the model inference**
         1. As you are now quantifying the performance of your model under novel inference, now is the time to enable your inference mechanism to reconstruct positions in 3D.
         2. Verify that it is inferring under static conditions.
            1. If it does not do a good job at 3D reconstruction statically, it almost certainly has no chance at doing so dynamically.
         3. Verify that the inferences are being recorded.
            1. This is important if you need to figure out what error happens later.
         4. Verify that both inference and inference logging occurs correctly under dynamic conditions after the first run (ideally, after the first trial).
6. Data collection
   1. Drive as many task-representative laps as possible. Make sure to take breaks to account for:
      1. Driver fatigue (if collecting data manually at different speeds).
      2. EBS-engager fatigue (if collecting data autonomously).
      3. Dynamic changes (e.g., sensor disconnecting, sensor becoming loose, running out of storage on the Orin).
      4. Getting enough start-stop procedures in.
         1. This is moreso important for trackdrive, where you have a slower mapping stage and a faster deadreckoning stage.
7. Pack up
   1. Make sure you have ground truths. If not, recollect them.
   2. Make sure data collected is saved.
   3. Turn off the Orin after data is saved and the sensors.
      1. Data $$\to$$ sensors in that order.
   4. Disconnect power from the Orin and sensors.
   5. Pick up cones.
   6. Pack vehicle.
8. Leave testing track
9. Arrive at Shop
10. Debrief
    1.  Note any incidentals for next time in Confluence *and* ping the RE for the system (Reng Zheng).
        1.  This includes any anomalies that might affect data collected. False positives preferrable over false negatives.
    2.  Take collected data off the car.
    3.  Ping dependents of the collected data that the data has arrived.
    4.  ENSURE that the data has been collected off the car, and delete data on the car as needed for space for the next testing trip.

## Model Integration
With the live-demo done, you can now be reasonably assured that your perception system works. Now, you just need to test integration with the people downstream of you. In the case of AMY25/26, that is State Estimation and Motion Planning. These are now out of my technical wheelhouse, but I do have generic thoughts. Of concern to perception, nothing has changed from the live demo, so I repaste the procedure below for completion, of which perception's concerns for integration testing that have changed from the live-demo procedure are bolded.

### Procedure
1. Determine the type of **test** you need to run.
   1. For AMY25, this boils down to: accel, skidpad, or autocross.
2. Scout the proper testing location.
   1. Our tolerance of testing location is dependent on the data being representative of Michigan Motorspeedway *plus* the fact that the track is wide enough that should the car have an accident, there is sufficient space for EBS to engage. *This should be the same location you did training in, unless you want to specifically test how the car handles at a track it has never seen before.* If you do not do this, you risk getting a run-ending out-of-distribution (OOD) error, and if you have improperly chosen a testing location, this means a potentially car-ending accident.
3. Make packouts.
   1. This should be enough cones to make the track.
   2. The ground-truth data collection items.
      1. RTK+GNSS specifically for perception.
   3. The car being tested.
   4. The perception sensors.
   5. The perception computer.
      1. This includes the other computer(s) and parts necessary to interface off the car and store data if needed.
         1. For AMY 25 this is: the Orin, the small router, and a laptop that has X11 compatibility or a way to connect to a noVNC server on the Orin over LAN.
   6. A white balance reference.
   7. A camera able to shoot in raw without post white-balancing.
      1. Our on-car cameras techically can do this too.
   8. These items are *ALL* still necessary because if something goes wrong, you want to not only make it in-distribution (ID) for your model, but also list all the factors that contributed to the error
4. Arrive at testing center
5. Set up
   1. This involves:
      1. Track Setup
         1. Placing the cones.
         2. Collecting ground-truth location data of the cones (and preferably color too).
         3. Collect a white-balance sample by capturing a photo on track conditions with all cones in frame and the white balance sample in frame.
      2. Enabling the perception stack
         1. Start the sensors recording.
         2. Verify they are recording correctly under static conditions.
            1. Verify time syncing and no obstructions of sensors.
         3. Verify that they recorded correctly under dynamic conditions after the first run (ideally, after the first trial).
      3. Enabling the model inference
         1. As you are now quantifying the performance of your model under novel inference, now is the time to enable your inference mechanism to reconstruct positions in 3D.
         2. Verify that it is inferring under static conditions.
            1. If it does not do a good job at 3D reconstruction statically, it almost certainly has no chance at doing so dynamically.
         3. Verify that the inferences are being recorded.
            1. This is important if you need to figure out what error happens later.
         4. Verify that both inference and inference logging occurs correctly under dynamic conditions after the first run (ideally, after the first trial).
      4. **Enable the downstream autonomous driving components**
         1. As you are now quantifying the whole performance of the car in a novel situation, you also need to enable the parts that estimate state and drive it.
         2. Thus, you *still* need to verify that inferences are being recorded, for all parts of the stack now, in a static condition, as if it does not work statically, it has no chance of working under motion.
         3. You also need to verify inference logging too, now for *all* stack I/O, as without them, in a fatal situation, event reconstruction is impossible to do.
         4. You should also try to verify after the first dynamic run (ideally, the first dynamic trial) or else you could end up throwing away tons of data for a miniscule error.
6. Data collection
   1. Drive as many task-representative laps as possible. Make sure to take breaks to account for:
      2. EBS-engager fatigue (if collecting data autonomously).
      3. Dynamic changes (e.g., sensor disconnecting, sensor becoming loose, running out of storage on the Orin).
      4. Getting enough start-stop procedures in.
         1. This is moreso important for trackdrive, where you have a slower mapping stage and a faster deadreckoning stage.
7. Pack up
   1. Make sure you have ground truths. If not, recollect them.
   2. Make sure data collected is saved.
   3. Turn off the Orin after data is saved and the sensors.
      1. Data $$\to$$ sensors in that order.
   4. Disconnect power from the Orin and sensors.
   5. Pick up cones.
   6. Pack vehicle.
8. Leave testing track
9.  Arrive at Shop
10. Debrief
    1.  Note any incidentals for next time in Confluence *and* ping the RE for the system (Reng Zheng).
        1.  This includes any anomalies that might affect data collected. False positives preferrable over false negatives.
    2.  Take collected data off the car.
    3.  Ping dependents of the collected data that the data has arrived.
    4.  ENSURE that the data has been collected off the car, and delete data on the car as needed for space for the next testing trip.

# Conclusion
These procedures should outline everything in the physical world the autonomous needs to do to derisk their system on the actual car. These procedures should also mirror the simulacra testbed we've build to derisk the entire stack before putting it on a multi-thousand hour, hundred-thousand dollar car. Further posts should be forthcoming as we actually implement this on the testbed first and then the actual car, so you should look for those for you people in the potentially far future.
