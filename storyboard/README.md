#### Please use the [reference](https://github.com/virtual-labs/ph3-exp-dev-process/blob/main/storyboard/README.org) document to fill this template. Follow the [link](https://github.com/virtual-labs/ph3-exp-dev-process/tree/main/sample/storyboard) to view a sample storyboard document. 



## Storyboard: Calorimetry Using Bomb Calorimeter

This storyboard outlines the flow and structure of the virtual lab experiment designed to teach students how to measure the heat of combustion using a bomb calorimeter. It provides a step-by-step narrative that makes it easy for developers, instructors, and students to understand and visualize the experiment, its objectives, and its user interactions within the simulation environment.

Experiment 1: calorimetry Using Bomb caloerimeter

### 1. Story Outline
This experiment stimulates the process of measuring the heat of combustion of a substance using a bomb calorimeter. The user is guided step-by-step from theoretical understanding to practical calculation using a virtual environment. The goal is to help students visualize the working mechanism of a bomb calorimeter, understand the relation between temperature change and heat, and compute the calorific value of a given sample.

The simulation involves setting input parameters like sample type, mass, and water equivalent, followed by starting a combustion process virtually. The system provides real-time temperature data, helping users connect theoretical knowledge with actual data interpretation.


### 2. Story
The experiment begins by presenting the user with the theoretical background of calorimetry and the bomb calorimeter. After understanding the principles, the user navigates to a simulator where they can choose a fuel sample and input related values such as sample mass and water equivalent.

The simulator then triggers the combustion process, during which the temperature rise is plotted on a graph in real-time. This helps the student visualize the energy release. Once the process is completed, the user is prompted to calculate the heat released using the final temperature. The results are then used to determine the heat of combustion. A small quiz at the end tests the user's understanding and reinforces learning.


#### 2.3 Set the Pathway Activities:
The experiment begins with a brief introduction and learning objectives to guide the student. The user then proceeds to read the theory behind bomb calorimetry. Step-by-step, the student selects the appropriate fuel sample, inputs the necessary parameters (mass, water equivalent, etc.), and initiates the combustion process. The simulator will display the temperature change and automatically calculate the heat of combustion. At the end, the user completes a quiz to reinforce learning and test conceptual clarity.


##### 2.4 Set Challenges and Questions/Complexity/Variations in Questions:
The quiz will include both direct and applied questions to assess the learner’s understanding. Some questions will involve identifying errors in the experiment steps, others will ask for calculations based on the output values. To add complexity, the difficulty may gradually increase—from basic definitions to analyzing data patterns. This keeps the learner engaged and encourages deeper understanding of the experiment.

##### 2.5 Allow pitfalls:
To enhance learning, certain pitfalls will be deliberately introduced. For example, if the student skips calibration or inputs unrealistic data, the simulator will show unexpected or incorrect results. These mistakes will serve as feedback opportunities, prompting users to revisit steps and correct their approach. This encourages critical thinking and reinforces the importance of accuracy in scientific procedures.
##### 2.6 Conclusion:
To enhance learning, certain pitfalls will be deliberately introduced. For example, if the student skips calibration or inputs unrealistic data, the simulator will show unexpected or incorrect results. These mistakes will serve as feedback opportunities, prompting users to revisit steps and correct their approach. This encourages critical thinking and reinforces the importance of accuracy in scientific procedures.

##### 2.7 Equations/formulas: NA
The experiment involves basic thermodynamic principles. The primary equation used is:

*Q = mcΔT*

Where:  
- Q = Heat released or absorbed (in joules)  
- m = Mass of the substance (in kg or g)  
- c = Specific heat capacity (J/kg·K or J/g·°C)  
- ΔT = Change in temperature (T_final - T_initial)

This equation is applied to determine the heat of combustion of the given sample. The system is assumed to be perfectly insulated, so all heat released by the reaction is absorbed by the water and the calorimeter.


### 3. Flowchart
Link to flow chart Here : Store in the  /flowchart folder within pedagogy folder in your repo
<br>
(Guide :The lab proposer should extract logic from the story, prepare a flowchart from the story narration and write the algorithm to execute the black box.  use Google Drawings https://docs.google.com/drawings/ (send the link to your flowchart and also attach .png by exporting it )

### 4. Mindmap
 Link to mindmap here : Store the mindmap in both .mm & .png extension in the  /mindmap folder and include link of only .pdf verison here
 <br>
 (Guide : An elaborate mind map (connecting all the points in the experiment flow ) should be prepared and submitted by the lab proposer. The mind map should be a clear and detailed document that takes into account all minute intri5acies involved in the development of virtual lab. The mindmap should be self-content and any developer across the globe should be able to code it with all those details. using only FreeMind http://freemind.sourceforge.net/wiki/index.php/Main_Page (send the .png file and also the original .mm extension project file. )

### 5. Storyboard

Link the storyboard (.gif file ) in here :
(Guide: This document should include sketching and description scene wise (duration, action, description). Software to be used for storyboarding : https://wonderunit.com/storyboarder/ (Its a FOSS tool).
