---
order: "0"
description: Capstone project for the Introduction to Electric Circuits course
---
### Background

This project is the capstone project for the **Introduction to Electric Circuits** course (Semester 25-1). This course provides foundational understanding of analog circuits, covering essential components such as resistors, inductors, capacitors, and operational amplifiers (op-amps). Unlike other final projects which typically commence late in the term, this project began at the beginning of the semester due to its extensive scope and massive work to do.

### Objective

The goal of this project was to build a fully working PCB that does something (basically anything) in **analog circuit**. This meant we were **ONLY** able to use components such as resistors, inductors, capacitors, op-amps and some sensors (we weren't able to use transistors to build a logic related stuff). Also we had restriction on budget which was ₩40,000 (about $26).

Our team aimed to engineer a circuit that activates an LED specifically when a clap sound is detected. A critical design constraint was **selectivity**: the system was required to react exclusively to a clap sound, effectively ignoring ambient noise and other distinct sounds.

> [!TIP] Note on Design Complexity
> The solution would have been trivial if we omitted the requirement for sound filtering, simply constructing a circuit triggered by any sound exceeding a specific decibel threshold. However, to make this project more challenging, we prioritized high-precision detection. This goal drove our development efforts throughout the semester. 

### Procedure

The overall procedure of this project was done as follows:

1. **Problem Definition**: To react to a clap sound exclusively, we needed to find acoustic properties of a "clap". Therefore, we recorded clap and other distinct sounds to determine characteristics required for detection.

2. **Circuit Design & Simulation**: From the characteristics we found, we designed the circuit and conducted simulations (on LTspice) to verify theoretical functionality.

3. **Breadboard Prototype**: Before taping out PCB directly, to validate the circuit in a real-word conditions, we implemented the designed circuit to breadboard and fixed some parts of the circuit.

4. **PCB Design & Verifying**: After verifying the functionality with breadboard, we designed PCB, ordered fabrication, and soldered the components to complete the PCB. Then we checked if the PCB worked as intended.

By following above procedures, we were able to successfully build a clap exclusive detecting PCB and demonstrated to our peers & professors. If you are curious about the details, they are below.

#### Problem Definition

To find the acoustic characteristics of a clap, we recorded the clap sound and saw how it appeared in the frequency domain. I used python to do Fourier transform of a recorded clap sound and it looked like below:

![[Pasted image 20260219195134.png|center]]

It's quite easy to find when the clap occurred from the figure above. Near the time axis where the values are 20 and 40, there are two high poles that shows uniform decibel across the frequency (you can see the cutoff at ~8000Hz because of the Nyquist sampling theorem).

We thought about why does clap sound have uniform intensity across the overall frequency. Luckily, at that semester, I was also taking **Signals and Systems** course which managed to do Fourier transform on various functions and I was able to think of FT of dirac-delta function which becomes a constant function. 

If we look back at the time-intensity graph (more of a sample-intensity graph actually) of a recorded clap sound, which is the figure below, you can see that peak that looks similar to dirac-delta function. 

![[Pasted image 20260219215047.png|center]]

In conclusion, we modeled the ideal clap sound as a dirac-delta function. To detect this, we planned to design a circuit that can detect the intensity at 5kHz, 7.5kHz, and 10kHz to see if the intensity exceeds threshold and if all of them exceeds, then it activates LED, meaning that sound is assessed as a clap sound. (We thought detecting intensity at those 3 frequencies were enough because noise from everyday life doesn't really contain high-frequency sound)
#### Circuit Design & Simulation

From the characteristics found above by inspecting a clap sound, we came up with the overall flow of the circuit as below. To briefly describe the figure below, by using MIC sensor we invert sound to electric signals and pass them to 3 band-pass filter in parallel to determine the intensity exceeds the threshold with comparator. After determining, pass the signals and add them up with voltage adder and if it exceeds another threshold, this time it determines if all 3 of them exceeded the threshold. Finally, the circuit activates LED if the circuit assess the sound as the clap sound.

![[Pasted image 20260219222222.png]]

We implemented the circuit with this flow on LTspice which is a circuit simulation program. It looks like below:

![[Pasted image 20260219231215.png|center]]

Here are the explanation of components that make up this circuit.
##### Components

1. **MIC Preamplifier**

The MIC sensor only outputs signal in voltage at scale of a few $mV$. This intensity is insufficient to be used in following circuits, therefore we needed to amplify this sound signal with some gain. The circuit below does the job. We also added some capacitors to stabilize the output signal. 

| ![[Pasted image 20260220005123.png]] | ![[Pasted image 20260220005128.png]] |
| ------------------------------------ | ------------------------------------ |


2. **Bandpass filter**

Explained from above, this bandpass filter only allows frequency that's in the bandwidth to go through. To be more specific, it amplifies the intensity of the frequency that's in the bandwidth and reduces the intensity of frequency outside the bandwidth near zero. By using this bandpass filter, we can filter the signals that have frequency near 5kHz, 7.5kHz, and 10kHz. In this project, we used 4-pole bandpass filter with gain of 10.

| ![[Pasted image 20260220005149.png]] | ![[Pasted image 20260220005153.png]] |
| ------------------------------------ | ------------------------------------ |


3. **Delay Circuit by using Op-Amps**

This circuit makes spike signal into a long-decreasing signal. This circuit is used when converging the 3 outputs of the bandpass filter since the circuit processes it in parallel and if the output come out as spikes, the delay between the signals can lead to error in detection. Therefore this circuit is used just before the output signal of the bandpass filter goes to the voltage adder. Also, this circuit is used in LED activation circuit to hold the signal long enough to see the LED.

![[Pasted image 20260220005222.png|center]]

4. **Voltage Comparator**

This voltage comparator compares the voltage intensity between the two inputs. The output becomes $5V$ when one is higher than other and $0V$ when it's the opposite. This circuit is used to determine whether the intensity of the frequency on some bandwidth is higher than the threshold, meaning it's used on each bandpass filter.

![[Pasted image 20260220005243.png|center]]

5. **Voltage Adder**

Addition circuit using op-amps. Nothing special about this one. This circuit is used to sum up the output signals of 3 bandpass filters and pass on to voltage comparator to assess whether the voltage intensity is enough to say that sound has enough intensity through 5kHz, 7.5kHz and 10kHz area.

| ![[Pasted image 20260220005301.png]] | ![[Pasted image 20260220005305.png]] |
| ------------------------------------ | ------------------------------------ |


##### Simulation

Figure below shows the result of the simulation. The $V(signalout)$ shows the input signal of this whole circuit (basically the output of the MIC sensor). The next 3 signals below shows the output of the bandpass filter of 5kHz, 7.5kHz, and 10kHz each. $V(filout1)$ is the output signal of filter of 5kHz and $V(bout1)$ refers to the signal that goes through the delay circuit. Then three signals adds up in the voltage adder and goes through comparator to see if it's over the threshold. If it's over the threshold, output occurs shown on $V(n018)$. It's possible to see the spike only on the clap sound and completely ignoring noises.

![[Pasted image 20260220005422.png|center]]


#### Breadboard Prototype

After verifying the simulation, we worked on the breadboard implementation. This part was one of the most hardest part of the project. It took 2 weeks to implement fully working circuit since we also had to deal with some problems when implementing. You can see the fully implemented circuit below. (I know it's a mess)

![[20250513_225515.jpg|center|300]]

We encountered some problems when implementing it, but it wasn't that hard. By searching through the internet and fixing the circuits a little bit, we were able to make breadboard prototype work as intended. And it worked out pretty great. The accuracy was quite beyond our expectation (I didn't expected this to work this well).
#### PCB Design & Verifying

After verifying the circuit by breadboard implementation, we used EasyEDA to design the schematic of PCB as below. (actually this is the final version, I lost the before version) We ordered PCB with the schematic we designed and got the first version of the PCB and soldered the components on it.

| ![[Pasted image 20260219230032.png]] | ![[Pasted image 20260219230124.png]] |
| ------------------------------------ | ------------------------------------ |

![[1771512586733.jpg|center|350x350]]

When the soldering was done, we applied voltage and tested if it worked. Unluckily, it didn't work (kinda obvious). We tried to find out what was the problem and found two problems on the circuit:

- **Missing Connections**: When designing the schematic, we missed 3 connections. To fix this, be soldered a wire onto the PCB.
- **Op-Amp's Insufficient Slew-rate**: After fixing the missing connections, the PCB didn't still work as intended. We used multimeter and oscilloscope to find what was wrong and the difference between the breadboard implementation. By investing a lot of time to find what was wrong, we found out the slew-rate (the limit of voltage rising speed) of the op-amp was not enough to pass the signal to the voltage adder since the frequency of the signal was pretty high. This also explained why the circuit on breadboard worked but PCB didn't work. The model of the op-amp was different because we had to use SMD type on the PCB. To solve this problem, we found another op-amp that had enough slew-rate to make this circuit functional.

By addressing these issues, we (again) designed the schematic and ordered the final PCB which looks like below. This time we also added a ground-pool to increase the stability. (you can see the blue area with full of copper which is a ground-pool)

![[Pasted image 20260219230311.png|center|350x350]]
![[20250612_214554 1.jpg|center|350x350]]

When the PCB was delivered, we soldered the components on the PCB and applied voltage to see if it worked. This time, luckily, it worked at once! We adjusted the variable resistor to form suitable threshold and checked the PCB working as intended.
### Conclusion

By working on the project, I was able to find some limitations on our design. When we were done soldering our final PCB and adjusting variable resistance on 3 bandpass filters, I found that the signals on 7.5kHz and 10kHz were very low and tried to amplify best as we can, however the intensity of the signals weren't enough. This meant we couldn't really use the signals from two bandpass filters, but the surprising thing was the PCB showed high-precision detecting on a clap sound. This meant the clap detecting was enough with just one bandpass filter at 5kHz. This was probably possible since the noise surrounding us didn't really have high frequency component. It also worked well on the demonstration day which was very noisy and loud. 

Anyways, the journey through the semester was quite challenging but fun. It was quite surprising to see the PCB working as intended at the last moment. We had demonstration on our peers & professors which was quite exhausting but it was a memorable experience. 