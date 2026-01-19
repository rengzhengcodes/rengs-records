---
title: 'Perception Testing: Statics and Dynamics on the Testbed'
author: Reng Zheng
date: '10-06-2025'
image:
   url: '/fsae/perception/bryce-test-platform.jpg'
   alt: "Perception Testbed feat. Bryce's hand."
---

# Background
Thanks to the hard-working [Bryce Forsgren](https://www.linkedin.com/in/bryce-forsgren/) on Sunday, we have recovered from a fatal communication-fallthrough-induced manufacturing for design error on our testbed that happened this Saturday, where our 3D printed items did not *quite* fit the way we wanted them to. 

Now, it is Monday, 9:30AM, and I have a few hours to make sure the software and mechanisms are actually ready for deployment. This post therefore serves as documentation and consciousness-dump.

# Notable Mechanical Things to Watch For
The following are notable mechanical facts of the car. Italicized sections are of importance and should be committed to memory.

1. On Sunday during manufacturing, Bryce and I forgot to account for the power holes in the Orin when making the mounting braces for it. However, because of Bryce's powers of foresight, *there is just enough tolerance if you shift the brace left a bit to plug in a power adapter*.
2. The mounting brace by necessity needed to cover some of the I/O, which in this case was the microUSB hole, like 2 columns of GPIO pins, and reduced the width of the USB-As and USB-Cs on the GPIO side of the Orin.
3. The batteries are mounted with *VHB tape*. Should hold in dynamics, but also easily removable if needed for say, charging.
4. The mounting clips connecting the testbed to the suspension and undercarriage seem to have rusted in place.
5. The front mounting clip needed to be epoxied in place. Should hold, curing seems fine.
6. There's a sheer in the roll hoop. *Careful when lifting by there*.
7. ***IT IS NOT WATERPROOF.***
8. The protection envelope afforded to us by out CF-infused PLA mounting braces, roll hoop, and front bumper should protect all the valuable internals from a one-time shock induced by a roll-over event.
   1. If this one-time shock happens:
      1. **STOP TESTING. IMMEDIATELY SHUT OFF MOTORS, SAVE DATA, AND RETURN TO SHOP.** 
      2. Contact [Selinna Lin](https://www.linkedin.com/in/selinna-lin/) (or your Autonomous Lead if you're referencing this in future years), Bryce Forsgren (or whoever is in charge of your testbed), *and* me (or whoever is the RE surrogate for autonomous for your testbed MechE).
   2. Additionally, envelope piercing is quote possible if you run into an object with a lip, which would be able to pass the front bumper unimpeded and puncture either the LIDAR enclosure or a lens. Please ensure proper environmental protection *and* driving before you proceed for this reason. These sensors are super expensive to replace.

# Notable Electrical Things About the Testbed
1. ***IT IS NOT WATERPROOF.***
2. Everything in the PoE injector has been capton-taped.
3. There's no grounding or shielding on the ethernet wires, so if there's a lot of EMF packet loss and corruption is to be expected.
4. [Claudius Tewari]() graciously 

# Startup Procedures
The following are the start up procedures for the testing platform. It should hold both in statics and dynamics.

1. If you are outside, do these steps first:
   1. 
2. Plug in your power solution
   1. Outdoors, Testbed: Your battery pack.
   2. Indoors, Testbed: Your wall charger.
   3. Outdoors, Car: Your LVBatt.
   4. Indoors, Car: Your LVBatt.
3. Turn on your Orin and connect a display and peripherals.
   1. Currently it is a monitor via displayport and a mouse and keyboard via USB.
   2. We *hope* to get one that automatically spins up, connects to our testing router, and launches a noVNC terminal or equivalent remote-client with GUI solution in the future.
4. The following steps may require internet, depending on whether or not you remembered to pull from origin before testing:
   1. `$ cd ~/Documents/ws/FSAE-Autonomous`.
   2. `$ git log` to ensure you are on the correct commit.
      1. Press `q` to exit `git log`.
      2. Switch to the correct commit if not; you may need to `git switch <branch-name> && git pull` and/or `git checkout <commit-hash>` if the Orin was not pre-prepped beforehand.
5. `$ make real` to launch the docker container for the Orin environment.
   1. `$ docker exec -it <container-name> /bin/bash.sh` will connect another terminal to that container. In this case, `container-name` should be `fsae-auto-real`.
   2. You can find the list of running containers with `$ docker container ls`.
6. 