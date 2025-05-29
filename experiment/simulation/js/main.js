// --- DOM Elements ---
        const calorimeterWrapper = document.getElementById('calorimeterWrapper');
        const tooltip = document.getElementById('tooltip');
        const infoPanel = document.getElementById('infoPanel');
        const infoText = document.getElementById('infoText');
        const infoPanelTitle = infoPanel.querySelector('h3');
        const closeInfoPanelButton = document.getElementById('closeInfoPanelButton');
        const startButton = document.getElementById('startButton');
        const nextButton = document.getElementById('nextButton');
        const resetButton = document.getElementById('resetButton');
        const calculateButton = document.getElementById('calculateButton'); // New: Calculate button

        // New Calculation Screen Elements
        const calculationScreen = document.getElementById('calculationScreen');
        const fuelSelect = document.getElementById('fuelSelect');
        const pieChartContainer = document.getElementById('pieChartContainer');
        const pieChartLegend = document.getElementById('pieChartLegend');
        const userCalorificValueInput = document.getElementById('userCalorificValueInput'); // Corrected ID
        const checkCalorificValueButton = document.getElementById('checkCalorificValueButton');
        const calculationFeedback = document.getElementById('calculationFeedback');
        const calculationParametersDiv = document.getElementById('calculationParameters'); // Added
        const calculationFormulaDiv = document.getElementById('calculationFormula'); // Added


        // SVG elements for manipulation
        const thermometerMercury = document.getElementById('thermometerMercury');
        const sampleElement = document.getElementById('sample');
        const stirrerBlade = document.getElementById('stirrerBlade'); // The blade part for rotation
        const stirrerGroup = document.getElementById('stirrerGroup'); // Group for highlighting the entire stirrer
        const ignitionCoil = document.getElementById('ignitionCoil');
        const ignitionWires = document.querySelectorAll('.ignition-wire');
        const svgElements = document.querySelectorAll('.hoverable');
        let activeHighlightedElement = null; // To track currently highlighted element

        // --- Global State Variables ---
        let simulationActive = false;
        let simulationStep = 0;
        let currentSelectedFuel = null; // To store the key of the currently selected fuel

        // --- Component Information (Tooltips & Details) ---
        const componentInfo = {
            outerCasing: "The protective outer shell of the calorimeter.",
            outerCasingTop: "The top face of the outer casing.",
            insulatingJacket: "Provides insulation to minimize heat loss to the surroundings.",
            bucket: "Holds the water and the bomb, absorbing heat from the reaction.",
            water: "The heat sink; its temperature change is measured to calculate heat released.",
            airSpace: "Air gap for additional insulation between the bucket and outer casing.",
            steelBomb: "A strong, sealed container where the combustion reaction occurs.",
            bombLid: "The top part of the steel bomb, sealed to contain the reaction.",
            crucible: "A small cup inside the bomb that holds the sample.",
            sample: "The substance undergoing combustion.",
            ignitionCoil: "Heats up to ignite the sample in the presence of oxygen.",
            ignitionWireLeft: "Carries current to the ignition coil.",
            ignitionWireRight: "Carries current to the ignition coil.",
            ignitionWireTopLeft: "Connects to the external power source.",
            ignitionWireTopRight: "Connects to the external power source.",
            stirrerGroup: "Continuously mixes the water to ensure uniform temperature distribution.", // Use group ID for info
            thermometer: "Measures the temperature change of the water.",
            oxygenTube: "Delivers oxygen to the bomb.",
            oxygenValve: "Controls the flow of oxygen into the bomb.",
            oxygenTubeBomb: "Connects the oxygen supply to the bomb interior.",
            heaterLeft: "Used to initially adjust or maintain water temperature.",
            heaterRight: "Used to initially adjust or maintain water temperature."
        };

        const componentDetails = {
            outerCasing: { title: "Outer Casing", description: "This is the outermost protective layer of the bomb calorimeter. It houses all the internal components and provides structural integrity. Its robust design ensures safety during experiments." },
            insulatingJacket: { title: "Insulating Jacket", description: "The insulating jacket, often made of air or a vacuum, minimizes heat exchange between the calorimeter's internal components and the external external. This ensures that almost all heat from the reaction is absorbed by the water." },
            bucket: { title: "Calorimeter Bucket", description: "This metallic bucket contains the water that absorbs the heat released by the combustion reaction. It's designed to efficiently transfer heat from the bomb to the water." },
            water: { title: "Water (Heat Sink)", description: "A precisely measured quantity of water acts as the heat sink. The temperature change of this water is the primary measurement used to calculate the heat of combustion. Water's high specific heat capacity makes it ideal for this purpose." },
            steelBomb: { title: "Steel Bomb (Combustion Vessel)", description: "This thick-walled, sealed steel vessel is where the sample is combusted in a high-pressure oxygen atmosphere. It's built to withstand the pressure and heat generated during the exothermic reaction." },
            crucible: { title: "Crucible", description: "A small, heat-resistant cup (often platinum or stainless steel) that holds the sample to be combusted within the steel bomb. It ensures the sample is contained and completely burned." },
            sample: { title: "Sample", description: "The substance (e.g., food, fuel) whose heat of combustion is being determined. A small, precisely weighed amount is placed in the crucible." },
            ignitionCoil: { title: "Ignition Coil / Wire", description: "A thin wire (often platinum or nickel-chromium) that is heated electrically to initiate the combustion of the sample. Once the wire glows red, it ignites the sample." },
            stirrerGroup: { title: "Stirrer", description: "The stirrer continuously mixes the water in the calorimeter bucket. This ensures that the heat released from the bomb is uniformly distributed throughout the water, allowing for an accurate temperature measurement by the thermometer." },
            thermometer: { title: "Thermometer", description: "A highly accurate thermometer (e.g., a Beckmann thermometer or digital thermometer) is used to measure the initial and final temperatures of the water. The precision of this measurement is critical for accurate heat calculations." },
            oxygenTube: { title: "Oxygen Inlet Tube", description: "This tube allows for the controlled introduction of high-pressure oxygen into the steel bomb before combustion. Oxygen is essential for complete combustion of the sample." },
            oxygenValve: { title: "Oxygen Supply Valve", description: "Controls the flow of oxygen from an external tank into the bomb." },
            heaterLeft: { title: "Immersion Heater", description: "Sometimes a small immersion heater is included to precisely adjust the initial temperature of the water to a desired starting point before the experiment begins." },
            heaterRight: { title: "Immersion Heater", description: "Sometimes a small immersion heater is included to precisely adjust the initial temperature of the water to a desired starting point before the experiment begins." }
        };

        // --- Simulation Steps Configuration ---
        const initialThermometerHeight = 200;
        const initialThermometerY = 380;
        const maxThermometerRise = 100;

        const simulationSteps = [
            {
                description: "Welcome! Click 'Start Simulation' to begin learning about the bomb calorimeter. Once the simulation is complete, you can click on individual parts for more details.",
                action: () => {
                    infoPanel.classList.add('visible'); // Always visible to show initial text
                    infoPanelTitle.textContent = "Welcome!"; // Set title for welcome
                    startButton.disabled = false;
                    nextButton.disabled = true;
                    resetButton.disabled = true;
                    calculateButton.classList.add('hidden'); // Hide calculate button
                    calculateButton.disabled = true; // Disable calculate button
                    // Reset all visuals to default
                    resetVisuals();
                    // Ensure individual interactions are enabled at start
                    enableIndividualInteractions();
                    closeInfoPanelButton.style.display = 'none'; // Hide close button for simulation steps
                },
                highlight: [] // No elements highlighted at start
            },
            {
                description: "Step 1: **Sample Preparation & Oxygenation.** A known mass of the sample is placed in the crucible within the steel bomb. The bomb is then pressurized with pure oxygen.",
                action: () => {
                    infoPanelTitle.textContent = "Simulation Step 1:"; // Set title for simulation steps
                    closeInfoPanelButton.style.display = 'none'; // Hide close button for simulation steps
                    // Add highlights
                    document.getElementById('sample').classList.add('highlighted');
                    document.getElementById('crucible').classList.add('highlighted');
                    document.getElementById('steelBomb').classList.add('highlighted');
                    document.getElementById('oxygenTube').classList.add('highlighted');
                    document.getElementById('oxygenValve').classList.add('highlighted');
                    // Fade others out (if they are not part of the current highlight)
                    svgElements.forEach(el => {
                        if (!['sample', 'crucible', 'steelBomb', 'oxygenTube', 'oxygenValve'].includes(el.id)) {
                            el.classList.add('fade-out');
                        } else {
                             el.classList.remove('fade-out'); // Ensure highlighted elements are fully visible
                        }
                    });
                },
                highlight: ['sample', 'crucible', 'steelBomb', 'oxygenTube', 'oxygenValve']
            },
            {
                description: "Step 2: **Calorimeter Assembly.** The sealed bomb is carefully placed into the known quantity of water within the calorimeter bucket. The stirrer and thermometer are then inserted into the water.",
                action: () => {
                    infoPanelTitle.textContent = "Simulation Step 2:";
                    closeInfoPanelButton.style.display = 'none';
                    // Add highlights
                    document.getElementById('bucket').classList.add('highlighted');
                    document.getElementById('water').classList.add('highlighted');
                    document.getElementById('thermometer').classList.add('highlighted');
                    stirrerGroup.classList.add('highlighted'); // Highlight the group
                    document.getElementById('steelBomb').classList.add('highlighted'); // Bomb remains highlighted
                    // Fade others out, keep new highlights visible
                    svgElements.forEach(el => {
                        if (!['bucket', 'water', 'thermometer', 'stirrerGroup', 'steelBomb', 'bombLid'].includes(el.id)) {
                             el.classList.add('fade-out');
                        } else {
                            el.classList.remove('fade-out'); // Ensure previously highlighted remain visible
                        }
                    });
                },
                highlight: ['bucket', 'water', 'thermometer', 'stirrerGroup', 'steelBomb']
            },
            {
                description: "Step 3: **Ignition.** An electric current is briefly passed through the ignition wires, causing the ignition coil to heat up and ignite the sample in the oxygen-rich environment.",
                action: () => {
                    infoPanelTitle.textContent = "Simulation Step 3:";
                    closeInfoPanelButton.style.display = 'none';
                    // Add ignition glow effect
                    ignitionCoil.classList.add('igniting');
                    ignitionWires.forEach(wire => wire.classList.add('igniting'));

                    gsap.to(sampleElement, { duration: 1, fill: '#555', ease: "power1.inOut" }); // Simulate burnt sample

                    // Add highlights
                    document.getElementById('ignitionCoil').classList.add('highlighted');
                    document.getElementById('ignitionWireLeft').classList.add('highlighted');
                    document.getElementById('ignitionWireRight').classList.add('highlighted');
                    document.getElementById('ignitionWireTopLeft').classList.add('highlighted');
                    document.getElementById('ignitionWireTopRight').classList.add('highlighted');
                    document.getElementById('sample').classList.add('highlighted'); // Sample also highlighted as it ignites

                    // Fade others out, keep relevant highlights visible
                    svgElements.forEach(el => {
                        const relevantIDs = ['ignitionCoil', 'ignitionWireLeft', 'ignitionWireRight', 'ignitionWireTopLeft', 'ignitionWireTopRight', 'sample', 'crucible', 'steelBomb', 'bucket', 'water', 'thermometer', 'stirrerGroup'];
                        if (!relevantIDs.includes(el.id)) {
                             el.classList.add('fade-out');
                        } else {
                            el.classList.remove('fade-out');
                        }
                    });
                },
                highlight: ['ignitionCoil', 'ignitionWireLeft', 'ignitionWireRight', 'ignitionWireTopLeft', 'ignitionWireTopRight', 'sample', 'crucible', 'steelBomb']
            },
            {
                description: "Step 4: **Heat Transfer & Stirring.** The heat released from the combustion rapidly transfers from the bomb to the surrounding water. The stirrer continuously mixes the water to ensure even heat distribution.",
                action: () => {
                    infoPanelTitle.textContent = "Simulation Step 4:";
                    closeInfoPanelButton.style.display = 'none';
                    // Remove ignition glow
                    ignitionCoil.classList.remove('igniting');
                    ignitionWires.forEach(wire => wire.classList.remove('igniting'));

                    // Start stirring animation
                    // **CRUCIAL CHANGE:** Ensure transformOrigin is set for the blade's local coordinate system.
                    gsap.to(stirrerBlade, {
                        duration: 1.5,
                        rotation: 360,
                        repeat: -1,
                        ease: "none",
                        transformOrigin: "0% 0%" // This works because we translated the blade's origin to its pivot point
                    });

                    // Mercury rises animation
                    gsap.to(thermometerMercury, {
                        duration: 3,
                        attr: {
                            height: initialThermometerHeight + maxThermometerRise,
                            y: initialThermometerY - maxThermometerRise
                        },
                        ease: "power1.out"
                    });

                    // Add highlights
                    document.getElementById('water').classList.add('highlighted');
                    stirrerGroup.classList.add('highlighted');
                    document.getElementById('thermometer').classList.add('highlighted');
                    document.getElementById('steelBomb').classList.add('highlighted'); // Bomb is the heat source

                    // Fade others out, keep relevant highlights visible
                    svgElements.forEach(el => {
                        const relevantIDs = ['water', 'stirrerGroup', 'thermometer', 'steelBomb', 'bucket', 'bombLid'];
                        if (!relevantIDs.includes(el.id)) {
                             el.classList.add('fade-out');
                        } else {
                            el.classList.remove('fade-out');
                        }
                    });
                },
                highlight: ['water', 'stirrerGroup', 'thermometer', 'steelBomb']
            },
            {
                description: "Step 5: **Temperature Measurement.** The thermometer measures the highest temperature reached by the water. The total temperature change, along with the calorimeter's heat capacity, is used to calculate the heat of combustion.",
                action: () => {
                    infoPanelTitle.textContent = "Simulation Step 5:";
                    closeInfoPanelButton.style.display = 'none';
                    gsap.killTweensOf(stirrerBlade); // Stop stirring
                    gsap.to(thermometerMercury, { // Ensure mercury is at its peak
                        duration: 1,
                        attr: {
                            height: initialThermometerHeight + maxThermometerRise,
                            y: initialThermometerY - maxThermometerRise
                        },
                        ease: "power1.out"
                    });
                    document.getElementById('thermometer').classList.add('highlighted');
                    // Fade others out, keep only thermometer and water highlighted
                    svgElements.forEach(el => {
                        const relevantIDs = ['thermometer', 'water', 'steelBomb', 'bucket', 'stirrerGroup', 'bombLid'];
                        if (!relevantIDs.includes(el.id)) {
                             el.classList.add('fade-out');
                        } else {
                            el.classList.remove('fade-out');
                        }
                    });
                },
                highlight: ['thermometer', 'water', 'steelBomb', 'bucket', 'stirrerGroup']
            },
            {
                description: "Simulation Complete! You can now click on individual components for more detailed information, or click 'Reset' to restart the simulation.",
                action: () => {
                    infoPanelTitle.textContent = "Simulation Complete!";
                    nextButton.disabled = true;
                    resetButton.disabled = false;
                    calculateButton.classList.remove('hidden'); // Show calculate button
                    calculateButton.disabled = false; // Enable calculate button
                    enableIndividualInteractions(); // Re-enable individual interactions
                    resetVisuals(); // Reset all visual changes from simulation steps
                    closeInfoPanelButton.style.display = 'block'; // Show close button after simulation
                },
                highlight: [] // No elements highlighted at end
            }
        ];

        // --- Fuel Data for Calculation ---
        const fuelData = {
            coal: {
                name: "Coal",
                pie: [
                    { label: "Heat Released (80%)", value: 80, color: "#e74c3c" },
                    { label: "Potential Work (15%)", value: 15, color: "#3498db" },
                    { label: "Losses (5%)", value: 5, color: "#95a5a6" }
                ],
                calc: {
                    massFuel: 1.5, // g
                    waterEquivalentCalorimeter: 1500, // J/°C
                    massWater: 2000, // g
                    initialTemp: 25.0, // °C
                    finalTemp: 28.5, // °C
                    specificHeatWater: 4.184 // J/g°C
                },
                formula: "Q = ((C * ΔT) + (M * c * ΔT)) / m",
                formulaExplanation: "Where: <br> Q = Calorific Value (J/g) <br> C = Water Equivalent of Calorimeter (J/°C) <br> ΔT = Change in Temperature (Final Temp - Initial Temp) (°C) <br> M = Mass of Water (g) <br> c = Specific Heat Capacity of Water (J/g°C) <br> m = Mass of Fuel (g)"
            },
            petrol: {
                name: "Petrol",
                pie: [
                    { label: "Heat Released (75%)", value: 75, color: "#e74c3c" },
                    { label: "Potential Work (20%)", value: 20, color: "#3498db" },
                    { label: "Losses (5%)", value: 5, color: "#95a5a6" }
                ],
                calc: {
                    massFuel: 1.0, // g
                    waterEquivalentCalorimeter: 1200, // J/°C
                    massWater: 1800, // g
                    initialTemp: 24.5, // °C
                    finalTemp: 29.8, // °C
                    specificHeatWater: 4.184 // J/g°C
                },
                formula: "Q = ((C * ΔT) + (M * c * ΔT)) / m",
                formulaExplanation: "Where: <br> Q = Calorific Value (J/g) <br> C = Water Equivalent of Calorimeter (J/°C) <br> ΔT = Change in Temperature (Final Temp - Initial Temp) (°C) <br> M = Mass of Water (g) <br> c = Specific Heat Capacity of Water (J/g°C) <br> m = Mass of Fuel (g)"
            },
            biogas: {
                name: "Biogas",
                pie: [
                    { label: "Heat Released (60%)", value: 60, color: "#e74c3c" },
                    { label: "Potential Work (30%)", value: 30, color: "#3498db" },
                    { label: "Losses (10%)", value: 10, color: "#95a5a6" }
                ],
                calc: {
                    massFuel: 2.5, // g
                    waterEquivalentCalorimeter: 1000, // J/°C
                    massWater: 2500, // g
                    initialTemp: 23.0, // °C
                    finalTemp: 26.0, // °C
                    specificHeatWater: 4.184 // J/g°C
                },
                formula: "Q = ((C * ΔT) + (M * c * ΔT)) / m",
                formulaExplanation: "Where: <br> Q = Calorific Value (J/g) <br> C = Water Equivalent of Calorimeter (J/°C) <br> ΔT = Change in Temperature (Final Temp - Initial Temp) (°C) <br> M = Mass of Water (g) <br> c = Specific Heat Capacity of Water (J/g°C) <br> m = Mass of Fuel (g)"
            },
            lpg: {
                name: "LPG",
                pie: [
                    { label: "Heat Released (78%)", value: 78, color: "#e74c3c" },
                    { label: "Potential Work (18%)", value: 18, color: "#3498db" },
                    { label: "Losses (4%)", value: 4, color: "#95a5a6" }
                ],
                calc: {
                    massFuel: 0.8, // g
                    waterEquivalentCalorimeter: 1300, // J/°C
                    massWater: 1500, // g
                    initialTemp: 26.0, // °C
                    finalTemp: 31.2, // °C
                    specificHeatWater: 4.184 // J/g°C
                },
                formula: "Q = ((C * ΔT) + (M * c * ΔT)) / m",
                formulaExplanation: "Where: <br> Q = Calorific Value (J/g) <br> C = Water Equivalent of Calorimeter (J/°C) <br> ΔT = Change in Temperature (Final Temp - Initial Temp) (°C) <br> M = Mass of Water (g) <br> c = Specific Heat Capacity of Water (J/g°C) <br> m = Mass of Fuel (g)"
            }
        };

        // --- Core Functions ---

        function resetVisuals() {
            gsap.killTweensOf(stirrerBlade); // Stop any ongoing stirrer animation
            gsap.killTweensOf(thermometerMercury);
            gsap.killTweensOf(ignitionCoil);
            ignitionWires.forEach(wire => gsap.killTweensOf(wire));

            svgElements.forEach(el => {
                el.classList.remove('highlighted', 'fade-out', 'fade-in'); // Ensure all temporary animation classes are removed
            });
            // Ensure no lingering styles from GSAP
            gsap.set(thermometerMercury, { attr: { height: initialThermometerHeight, y: initialThermometerY } });
            gsap.set(ignitionCoil, { stroke: '#ff4500' });
            ignitionWires.forEach(wire => gsap.set(wire, { stroke: '#ff0000' }));
            sampleElement.style.fill = 'url(#gradSample)'; // Reset sample color

            // Remove temporary glow from ignition
            ignitionCoil.classList.remove('igniting');
            ignitionWires.forEach(wire => wire.classList.remove('igniting'));
           
            // Explicitly reset the stirrer blade's rotation to its initial state
            gsap.set(stirrerBlade, { rotation: 0 }); // Reset rotation to 0
        }

        function updateSimulationDisplay() {
            const step = simulationSteps[simulationStep];
            infoPanel.classList.add('visible');
            infoPanelTitle.textContent = simulationStep === 0 ? "Welcome!" : `Simulation Step ${simulationStep}:`;
            infoText.innerHTML = step.description;

            // Reset all visual changes from previous step's action
            resetVisuals();

            // Apply visual changes for the current step
            step.action();

            // Disable individual interactions during active simulation steps
            if (simulationStep > 0 && simulationStep < simulationSteps.length - 1) {
                 disableIndividualInteractions();
            } else {
                 enableIndividualInteractions();
            }
        }

        function handleMouseOver(event) {
            if (simulationActive) return; // Do nothing if simulation is active

            const componentId = event.currentTarget.id;
            let idToUse = componentId;
            if (!componentInfo[componentId]) {
                const parentWithId = event.currentTarget.closest('[id]');
                if (parentWithId) {
                    idToUse = parentWithId.id;
                }
            }

            if (componentInfo[idToUse]) {
                tooltip.textContent = componentInfo[idToUse];
                tooltip.classList.add('visible');
                positionTooltip(event);
            }
        }

        function handleMouseOut() {
            if (simulationActive) return;
            tooltip.classList.remove('visible');
        }

        function handleMouseMove(event) {
            if (simulationActive) return;
            if (tooltip.classList.contains('visible')) {
                positionTooltip(event);
            }
        }

        function handleClick(event) {
            if (simulationActive) return; // Do nothing if simulation is active

            // Remove highlight from previously active element
            if (activeHighlightedElement) {
                activeHighlightedElement.classList.remove('highlighted');
            }
            infoPanel.classList.remove('visible'); // Hide info panel initially for click

            const componentId = event.currentTarget.id;
            let idToUse = componentId;
            if (!componentDetails[componentId]) {
                const parentWithId = event.currentTarget.closest('[id]');
                if (parentWithId) {
                    idToUse = parentWithId.id;
                }
            }

            if (componentDetails[idToUse]) {
                infoPanel.classList.add('visible');
                infoPanelTitle.textContent = componentDetails[idToUse].title;
                infoText.textContent = componentDetails[idToUse].description;
                event.currentTarget.classList.add('highlighted'); // Add highlight to clicked element
                activeHighlightedElement = event.currentTarget; // Set as active element
                closeInfoPanelButton.style.display = 'block'; // Show close button for individual component info
            } else {
                infoPanel.classList.remove('visible'); // Hide if no info found
                infoPanelTitle.textContent = "Click on a component to learn more!";
                infoText.textContent = "";
                activeHighlightedElement = null;
                closeInfoPanelButton.style.display = 'none'; // Hide close button if no info
            }
        }

        function positionTooltip(event) {
            const wrapperRect = calorimeterWrapper.getBoundingClientRect();
            // Get current mouse position relative to the wrapper
            let mouseX = event.clientX - wrapperRect.left;
            let mouseY = event.clientY - wrapperRect.top;

            // Adjust tooltip position to stay within the wrapper bounds
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
            const padding = 15;

            let finalX = mouseX + padding;
            let finalY = mouseY + padding;

            // Prevent tooltip from going off the right edge of the wrapper
            if (finalX + tooltipWidth > wrapperRect.width) {
                finalX = mouseX - tooltipWidth - padding;
                if (finalX < 0) finalX = mouseX + padding; // Fallback if it still goes off left
            }
            // Prevent tooltip from going off the bottom edge of the wrapper
            if (finalY + tooltipHeight > wrapperRect.height) {
                finalY = mouseY - tooltipHeight - padding;
                if (finalY < 0) finalY = mouseY + padding; // Fallback if it still goes off top
            }

            tooltip.style.left = `${finalX}px`;
            tooltip.style.top = `${finalY}px`;
        }

        function enableIndividualInteractions() {
            calorimeterWrapper.classList.remove('simulation-active');
            svgElements.forEach(element => {
                element.addEventListener('mouseover', handleMouseOver);
                element.addEventListener('mouseout', handleMouseOut);
                element.addEventListener('mousemove', handleMouseMove);
                element.addEventListener('click', handleClick);
            });
            document.addEventListener('click', handleClickOutsideInteractions);
        }

        function disableIndividualInteractions() {
            calorimeterWrapper.classList.add('simulation-active');
            svgElements.forEach(element => {
                element.removeEventListener('mouseover', handleMouseOver);
                element.removeEventListener('mouseout', handleMouseOut);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('click', handleClick);
            });
            tooltip.classList.remove('visible'); // Hide any active tooltip
            if (activeHighlightedElement) { // Clear any active highlight
                activeHighlightedElement.classList.remove('highlighted');
                activeHighlightedElement = null;
            }
            document.removeEventListener('click', handleClickOutsideInteractions);
        }

        function handleClickOutsideInteractions(event) {
            // Check if click is outside the calorimeter wrapper AND outside the info panel AND outside the controls
            const isClickOutsideWrapper = !calorimeterWrapper.contains(event.target);
            const isClickOutsideInfoPanel = !infoPanel.contains(event.target);
            const isClickOutsideControls = !startButton.contains(event.target) && !nextButton.contains(event.target) && !resetButton.contains(event.target) && !calculateButton.contains(event.target) && !fuelSelect.contains(event.target) && !userCalorificValueInput.contains(event.target) && !checkCalorificValueButton.contains(event.target);

            // If clicked outside all interactive areas for individual interactions
            if (isClickOutsideWrapper && isClickOutsideInfoPanel && isClickOutsideControls) {
                infoPanel.classList.remove('visible');
                if (activeHighlightedElement) {
                    activeHighlightedElement.classList.remove('highlighted');
                    activeHighlightedElement = null;
                }
            }
        }

        // --- Event Listeners for Simulation Controls ---
        startButton.addEventListener('click', () => {
            simulationActive = true;
            simulationStep = 1;
            updateSimulationDisplay();
            startButton.disabled = true;
            nextButton.disabled = false;
            resetButton.disabled = false;
            calculateButton.classList.add('hidden'); // Hide calculate button
            calculateButton.disabled = true; // Disable calculate button
            showSimulationScreen(); // Ensure simulation screen is visible
        });

        nextButton.addEventListener('click', () => {
            if (simulationActive && simulationStep < simulationSteps.length - 1) {
                simulationStep++;
                updateSimulationDisplay();
            }
            if (simulationStep === simulationSteps.length - 1) { // If it's the last step
                nextButton.disabled = true;
            }
        });

        resetButton.addEventListener('click', () => {
            simulationActive = false;
            simulationStep = 0;
            updateSimulationDisplay(); // This will also handle enabling individual interactions
            startButton.disabled = false;
            nextButton.disabled = true;
            resetButton.disabled = true;
            calculateButton.classList.add('hidden'); // Hide calculate button
            calculateButton.disabled = true; // Disable calculate button
            showSimulationScreen(); // Ensure simulation screen is visible
        });

        // New: Event listener for the close button on the info panel
        closeInfoPanelButton.addEventListener('click', () => {
            infoPanel.classList.remove('visible');
            if (activeHighlightedElement) {
                activeHighlightedElement.classList.remove('highlighted');
                activeHighlightedElement = null;
            }
        });

        // --- New Calculation Screen Functions ---

        calculateButton.addEventListener('click', showCalculationScreen);
        fuelSelect.addEventListener('change', (event) => {
            const selectedFuelKey = event.target.value;
            if (selectedFuelKey) {
                currentSelectedFuel = selectedFuelKey;
                displayFuelData(selectedFuelKey);
            } else {
                // Clear display if no fuel is selected
                pieChartContainer.innerHTML = '<p style="color: #666; font-size: 1.1em;">Select a fuel to see its conceptual energy distribution.</p>';
                pieChartLegend.innerHTML = '';
                calculationParametersDiv.innerHTML = ''; // Clear parameters
                calculationFormulaDiv.innerHTML = ''; // Clear formula
                userCalorificValueInput.value = '';
                calculationFeedback.textContent = '';
                currentSelectedFuel = null;
            }
        });
        checkCalorificValueButton.addEventListener('click', checkUserCalorificValue);


        function showCalculationScreen() {
            calorimeterWrapper.classList.add('hidden'); // Hide simulation diagram
            infoPanel.classList.add('hidden'); // Hide info panel
            calculationScreen.classList.remove('hidden'); // Show calculation screen
            disableIndividualInteractions(); // Ensure no interaction with hidden SVG elements
            clearHighlight(); // Clear any active highlights from simulation
            tooltip.classList.remove('visible'); // Hide any active tooltip

            // Reset fuel selection and calculation display
            fuelSelect.value = "";
            pieChartContainer.innerHTML = '<p style="color: #666; font-size: 1.1em;">Select a fuel to see its conceptual energy distribution.</p>';
            pieChartLegend.innerHTML = '';
            calculationParametersDiv.innerHTML = ''; // Clear parameters
            calculationFormulaDiv.innerHTML = ''; // Clear formula
            userCalorificValueInput.value = '';
            calculationFeedback.textContent = '';
            currentSelectedFuel = null;
        }

        function showSimulationScreen() {
            calorimeterWrapper.classList.remove('hidden'); // Show simulation diagram
            infoPanel.classList.remove('hidden'); // Show info panel
            calculationScreen.classList.add('hidden'); // Hide calculation screen
            enableIndividualInteractions(); // Re-enable interaction with SVG elements
        }

        function drawPieChart(data) {
            pieChartContainer.innerHTML = ''; // Clear previous chart
            pieChartLegend.innerHTML = ''; // Clear previous legend

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 100 100");
            pieChartContainer.appendChild(svg);

            let total = data.reduce((sum, item) => sum + item.value, 0);
            let currentAngle = 0;

            data.forEach(item => {
                const sliceAngle = (item.value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + sliceAngle;

                const startX = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
                const startY = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
                const endX = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
                const endY = 50 + 50 * Math.sin(Math.PI * endAngle / 180);

                const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                const pathData = [
                    `M 50,50`,
                    `L ${startX},${startY}`,
                    `A 50,50 0 ${largeArcFlag} 1 ${endX},${endY}`,
                    `Z`
                ].join(' ');

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", pathData);
                path.setAttribute("fill", item.color);
                path.setAttribute("stroke", "white");
                path.setAttribute("stroke-width", "0.5");
                svg.appendChild(path);

                // Add text label
                const midAngle = currentAngle + sliceAngle / 2;
                const textX = 50 + 35 * Math.cos(Math.PI * midAngle / 180);
                const textY = 50 + 35 * Math.sin(Math.PI * midAngle / 180);

                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", textX);
                text.setAttribute("y", textY);
                text.setAttribute("class", "pie-slice-label");
                text.textContent = `${item.value}%`; // Display percentage
                svg.appendChild(text);

                // Add to legend
                const legendItem = document.createElement('div');
                legendItem.classList.add('legend-item');
                legendItem.innerHTML = `
                    <div class="legend-color-box" style="background-color: ${item.color};"></div>
                    <span>${item.label}</span>
                `;
                pieChartLegend.appendChild(legendItem);

                currentAngle = endAngle;
            });
        }

        function displayFuelData(fuelKey) {
            const fuel = fuelData[fuelKey];
            if (!fuel) return;

            // Update pie chart
            drawPieChart(fuel.pie);

            // Update calculation parameters
            calculationParametersDiv.innerHTML = `
                <p class="calc-param"><span>Mass of Fuel (m):</span> <span>${fuel.calc.massFuel} g</span></p>
                <p class="calc-param"><span>Water Equivalent of Calorimeter (C):</span> <span>${fuel.calc.waterEquivalentCalorimeter} J/°C</span></p>
                <p class="calc-param"><span>Mass of Water (M):</span> <span>${fuel.calc.massWater} g</span></p>
                <p class="calc-param"><span>Initial Temperature (T1):</span> <span>${fuel.calc.initialTemp} °C</span></p>
                <p class="calc-param"><span>Final Temperature (T2):</span> <span>${fuel.calc.finalTemp} °C</span></p>
                <p class="calc-param"><span>Specific Heat Capacity of Water (c):</span> <span>${fuel.calc.specificHeatWater} J/g°C</span></p>
            `;

            // Update calculation formula
            calculationFormulaDiv.innerHTML = `
                <h4>Formula:</h4>
                <p style="font-style: italic; text-align: center; background-color: #e6eefc; padding: 10px; border-radius: 8px; border: 1px solid #c0d9f0;">
                    ${fuel.formula}
                </p>
                <p style="font-size: 0.9em; text-align: left; color: #555; margin-top: 10px;">
                    ${fuel.formulaExplanation}
                </p>
            `;


            // Clear previous user input and feedback
            userCalorificValueInput.value = '';
            calculationFeedback.textContent = '';
            calculationFeedback.classList.remove('feedback-correct', 'feedback-wrong');
        }

        function calculateCalorificValue(fuelKey) {
            const fuel = fuelData[fuelKey];
            if (!fuel) return NaN;

            const { massFuel, waterEquivalentCalorimeter, massWater, initialTemp, finalTemp, specificHeatWater } = fuel.calc;

            const deltaT = finalTemp - initialTemp;
            const heatReleased = (waterEquivalentCalorimeter + (massWater * specificHeatWater)) * deltaT;
            const calorificValue = heatReleased / massFuel;

            return parseFloat(calorificValue.toFixed(2)); // Round to 2 decimal places
        }

        function checkUserCalorificValue() {
            if (!currentSelectedFuel) {
                calculationFeedback.textContent = "Please select a fuel first.";
                calculationFeedback.classList.remove('feedback-correct');
                calculationFeedback.classList.add('feedback-wrong');
                return;
            }

            const userValue = parseFloat(userCalorificValueInput.value);
            if (isNaN(userValue)) {
                calculationFeedback.textContent = "Please enter a valid number.";
                calculationFeedback.classList.remove('feedback-correct');
                calculationFeedback.classList.add('feedback-wrong');
                return;
            }

            const correctValue = calculateCalorificValue(currentSelectedFuel);
            const tolerance = 0.01; // Allow for slight floating point inaccuracies

            if (Math.abs(userValue - correctValue) < tolerance) {
                calculationFeedback.textContent = "Correct! 100% accurate.";
                calculationFeedback.classList.remove('feedback-wrong');
                calculationFeedback.classList.add('feedback-correct');
            } else {
                // Calculate accuracy percentage, preventing negative values
                let accuracy = (1 - (Math.abs(userValue - correctValue) / correctValue)) * 100;
                if (accuracy < 0) { // Ensure accuracy is not negative
                    accuracy = 0;
                }
                const accuracyMessage = accuracy.toFixed(2);

                calculationFeedback.innerHTML = `Wrong! You were ${accuracyMessage}% accurate. The correct calorific value is ${correctValue} J/g. <br>Please try again.`;
                calculationFeedback.classList.remove('feedback-correct');
                calculationFeedback.classList.add('feedback-wrong');
            }
        }

        function clearHighlight() {
            if (activeHighlightedElement) {
                activeHighlightedElement.classList.remove('highlighted');
                activeHighlightedElement = null;
            }
            svgElements.forEach(el => {
                el.classList.remove('fade-out'); // Ensure all elements are visible again
            });
        }

        // --- Initial Setup on Page Load ---
        document.addEventListener('DOMContentLoaded', () => {
            updateSimulationDisplay(); // Show initial message and disable controls
            // Individual interactions are enabled by updateSimulationDisplay for step 0
        });
