---
title: 'Why did I choose High-Performance Computing?'
author: Reng Zheng
date: '08-24-2025'
image:
    url: 'https://s3.amazonaws.com/cms.ipressroom.com/219/files/20252/202503180805/quantum-computing.jpg'
    alt: 'Boston Q-Compute HPC Press Release Photo'
---

I applied to MIT to research bio-inspired approaches to AI development, from hardware to software. Part of the reason for that is because there is a litany of evidence that even with the invention of ChatGPT-5, Claude 4 Sonnet, and Gemini 2.5 Pro almost four years after I submitted my college applications, biological methods of cognition still greatly exceed artifical ones in the matter of *efficiency*.

## Data Efficiency
For the classically-trained AI folks, the first thought that may come when I say *efficiency* may be in regards to *data-efficiency*: how well a model can be trained on a novel task per unit data provided.[^1] We see at tasks with large datasets, artificial agents have achieved near superhuman performance. For example, in coding, where there are thousands of interview-style questions available at sites like [LeetCode](https://leetcode.com/) and uncountable amounts of online guides and examples on their completion, LLMs have achieved near superhuman performance. At AtCoder World Tour 2025, OpenAI's model was only narrowly defeated by one man, his worldclass skill, and his consistently peak performance over 10 hours.[^2] Similarly, in math, with a large published corpus of texts, and proof assistants like [Lean](https://lean-lang.org/) and [Rocq](https://rocq-prover.org/) allowing for proof validation across the vast number of published math problems, Google Deepmind has officially achieved IMO Gold level performance.[^3]

However, in items with novel, low-data tasks, like the ones presented by ARC-AGI, you would be hard-pressed to find any model competitive with humans. Especially so at a cost-effective price point:

<div class="center">
    <img class="pro-img" src="/src/content/posts/why-hpc/arc-prize-leaderboard-2025-08-24.png" alt="ARC-GIS Leaderboard as of Aug. 24, 2025" width=100% loading="lazy" decoding="async"/>
    <p>The ARC-AGI Leaderboards can be found <a href="https://arcprize.org/leaderboard">here</a>.</p>
</div>

As you can see, the average human still out-performs frontier artificial models, at a comparable price point, and achieves near-perfect performance on novel tasks. While the most popular jobs in society, by definition, are now well-documented, they still involve many novel situations that humans are more capable of handling than machines, thus continuing to require humans in the loop at some point. For example, self-driving cars have difficulty [recognizing novel objects](https://www.businessinsider.com/video-tesla-autopilot-appears-to-confuse-horse-drawn-carriage-truck-2022-8) that would not confuse the regular human counterparts, and this is [one of the most common tasks that the average American partakes in](https://www.bts.gov/statistical-products/surveys/national-household-travel-survey-daily-travel-quick-facts) with large-scale datasets, both [public](https://www.nuscenes.org/) and [private](https://www.inc.com/reuters/waymo-just-crossed-100-million-miles-of-driverless-rides-meanwhile-tesla-has-started-small/91213739). While they can have [superhuman safety](https://waymo.com/safety/impact/), these classification errors still require human-in-loop intervention to fix.

## Energy Efficiency
But enough about that. The data efficiency portion of the equation, while important, is less interesting to me than my personal Roman Empire: energy efficiency. We've already established above that the human is still at the pinnacle of novel tasks, but that does not matter if AI devices could feasibly replace most tasks humans do well-enough at scale. However, the important qualifier there is *at scale*. Beyond the [raw silicon requirements crucial to AI development](https://www.reuters.com/technology/artificial-intelligence/us-tightens-its-grip-ai-chip-flows-across-globe-2025-01-13/), there's also the raw electricity driving those chips and their associated machines, which LLMs also lack compared to humans at the edge of ability.

Starting off again with where the machines get it better: tasks with lots of data like drawings and manuscripts are currently [magnitudes more efficient](https://www.nature.com/articles/s41598-024-54271-x) when done by machines compared to human counterparts. This makes sense: the requirements of being a machine that simply draws outweighs that of a meat bag that needs to keep itself alive, learn new things, travels, has hobbies, consumes media from the global supply chain, et cetera, and draws. While I have some disagreements with the study for the purposes of comparing AI efficiency, it is undeniable that, as a whole unit, on a specific task, silicon has flesh beat.

But what about things that require more than just one task, like driving? Using the daily recommended values posted on food labels, the average human should be eating in the ballpark of 2,000 kCal[^4] per day. This number translates, via Google's unit converter, to 8,368 kJ of energy. Assuming an overly cushy 4 day workweek, 40 week working year, 40 years of work before retirement, and a century-long lifespan, this gives:

$$
\frac{Workdays}{Energy} = \frac{40~years \cdot \frac{40~weeks}{year} \cdot \frac{4~workdays}{week}}{\frac{8,368~kJ}{day} \cdot \frac{365.25~days}{year} \cdot 100~years} = \frac{6,400~workdays}{305,641,200~kJ}
$$

or, in terms of watts:

$$
Watts = \frac{Energy}{Workdays} \cdot \frac{workday}{8~hours} \cdot \frac{hour}{60~mins} \cdot \frac{min}{60~secs} \approx 1.658~kW
$$

While this seems pretty high, keep in mind that we grossly over-estimated the amount of leisure time this worker has, which means this number places a conservative upper bound on the human work-to-energy ratio. Now, let's check to see what silicon has. While state-of-the-art industry models [have unpublished energy consumption numbers](), cross-referencing with autonomous research vehicles, we can see that [242.8 Watts](https://www.mdpi.com/1424-8220/22/16/5999) are consumed. Thus, it seems that, in a lifetime, robots have us beat by almost 7x still in efficency!

But, now the important part, what about during the task itself? The human still needs to concern itself with mortgages, kids, learning new skills, et cetera in its leisure. If we instead take the daily caloric consumption and only apply it to the driver's working hours, we get:
$$
\frac{8,368 kJ}{workday} \cdot \frac{workday}{8~hours} \cdot \frac{3,600 seconds}{hour} = 290.\bar{5}W
$$

[^1]: For the uninitiated, you can roughly imagine it as $$\frac{\text{accuracy}}{\text{data points}}$$.
[^2]: https://arstechnica.com/ai/2025/07/exhausted-man-defeats-ai-model-in-world-coding-championship/
[^3]: https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/
[^4]: Curses to this land of imperial and the greater food body for dropping the kilo- prefix and using non-SI units respectively to address food consumption numbers.
[^5]: While both the study and I are focusing, broadly, on $\frac{energy}{task}$, I disagree with their accounting that energy 