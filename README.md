# TrashCam
A smart way to sort waste

## Inspiration
Based on personal experiences, we gathered that it’s not uncommon for a well educated person like us to be confused about what bin a trash item goes into. We did a little more research and found that according to a survey, 62% of the rubbish ends up in the wrong bin. Due to this contamination of recycling waste, only about 9% of all discarded plastic ends up getting recycled. So we figured, “Why leave room for human error when the issue is about saving the planet?”

## What it does
TrashCam is a smart waste sorting system that saves both time and money. When presented with a normal trash can, people have to pause and make the choice between compost, recycling, and trash, often throwing it into the wrong bin. People at waste facilities then have to manually sort through the waste. With TrashCam, one simply throws the waste into a single smart waste disposal system, which then automatically puts the waste into the right container for the user. Not only is this convenient, it also removes the burden of having to sort waste offsite. TrashCam also includes a web application that shows statistics of what’s been thrown away in the past day, past week, etc. We also built a React Native mobile app that works on iOS and android. The app allows users of our devices to collect points and work up a leaderboard by using our product and tapping their phone our device. We use NFC technology to read the chip on our device and determine which user is throwing away garbage.

## How I built it
We split the problem into parts - using computer vision to recognize the item, using a machine learning algorithm to classify the waste and the hardware which implements said classification.
<ul>
<li>Computer Vision: For the first part, we used a Raspberry Pi to click images of the trash item placed into the bin and ran it through the Google Cloud Vision API. The returned ‘tags’ were uploaded on Firebase.</li>
<li>Classification Algorithm: The Firebase data was entered into a separate classification algorithm to return ‘Recycle’, ‘Compost’ or ‘Landfill’.</li>
<li>Hardware: We used two flaps attached to microcontrolled servos to redirect the trash item into the right bin on the basis of the result of classification.</li>
<li>Web App: We used React JS to build a frontend displaying a bar graph and data. To retrieve our data, we configured our Raspberry Pi to upload information to Firebase Database, allowing the web app to read and display the data.</li>
<li>Mobile App: We built our mobile app using React Native.</li>
</ul>

## Challenges I ran into
One of our main challenges was building our sorting system hardware. To sort waste into two bins, one simply needs a single flap to push the waste one way or the other. However, we wanted to sort into three bins, which required two servos. We went through many different designs, including a design with a sweeper and a flap. We finally settled on a design with two shifting ramps, one slightly higher than the other. As software engineers, we did not expect the engineering to be so tough to build.

## Accomplishments that I'm proud of
<ol>
<li>After many failed iterations, we successfully got our sorting system to work as per the result of our classification result. It took a couple of motors and hundreds of calibration tests for it to work properly.</li>
<li>We couldn’t find a dataset classifying items into ‘Recycle’, ‘Compost’ and ‘Landfill’. We made our own algorithm to do that for us. It is in a prototype stage and works with a decent level of accuracy, but with minimal effort we are confident we could get it to work very accurately.</li>
</ol>

## What I learned
We learned that a viable hardware design is just as important as the software running under the hood. We realized that software is a deterministic system but hardware had many more uncontrollable factors and it needed much more effort than we expected. The unreliability of hardware tripped us up multiple times.

## What's next for TrashCam
So far, we’ve only built the prototype design. The next step would be to redesign our device with better materials to commercialize TrashCam. Primarily, we will market our product towards government and commercial institutions. We expect that it will not cost more than $50-80 to incorporate this technology into trash cans when mass produced. Apart from the long term ecological benefit and the intangible convenience to the public, it directly helps save millions of taxpayer dollars spent in sorting mixed waste and reduces losses due to recycling contamination.
