### What is Cross-Entropy?
*Cross-Entropy* is a term widely used in machine learning. It is used as a loss function when training a model. The cross-entropy equations looks like below:
$$
H(P, Q) = -\sum P(x) \ log \ Q(x)
$$

The term $P(x)$ stands for the actual probability distribution, while $Q(x)$ stands for the predicted distribution.

To get to the conclusion first, the value of cross-entropy shows the average number of bits you will use if you compress the data based on the model's assumed probabilities ($Q$) instead of the true probabilities ($P$). If $H(P, Q)$ is high, it means your model's assumptions are wrong, forcing you to use long, inefficient bit-codes for events that actually happen frequently. This is why it is used as a loss function: minimizing cross-entropy forces $Q$ to become identical to $P$, perfectly optimizing the compression.

### Why does this equation looks like that?
The value of the cross-entropy stands for the average number of bits for each information. Since $P(x)$ is the real probability distribution, $-log \ Q(x)$ is the number of bits our model **allocates** to represent $x$ based on its (often flawed) assumption. 

The question is: How does $-log \ Q(x)$ represent the number of bits for representation? Why is there log?

To get intuition for this, let's check out some properties that it should have.

※ The term "number of bits that is needed to represent the information (when perfectly compressed)" and "the amount of information (or surprise)" is being treated same here. Claude Shannon proved that both are basically the same thing. So do not worry about this.

#### 1. Guaranteed Events must have zero information

Let's say that there's an unfinished sentence: "The alphabetic order goes by: a, b, c, ". If a model is there to predict the next alphabet of this sentence, it would be obviously 'd'. Therefore, in this case, the sentence "The alphabetic order goes by: a, b, c, " and "The alphabetic order goes by: a, b, c, d" basically contains the same information. Leading to a conclusion that letter 'd' basically doesn't contain any information.

In conclusion, if there's a guaranteed event, it doesn't contain any information in that context. This leads to a fact that if $P(x) = 1$, then $I(x) = 0$.

#### 2. Less probable events give more information

In similar context to property 1, we can assume events with low probability gives more information since events of low probability happening gives a large surprise. Therefore, If $P(x)$ is low, $I(x)$ must be large.

#### 3. Information from independent events must be additive.

In probability, independent events are calculated by multiplication: $P(A \text{ and } B) = P(A) \times P(B)$. Because we need the resulting information to be additive ($I(A) + I(B)$), we must use a logarithm, as it is the only mathematical function that converts multiplication into addition: $\log(A \times B) = \log(A) + \log(B)$.

#### Conclusion
For the properties above, the term known as *Suprisal* or *Self-information* is defined as $-log \ P(x)$ since this expression satisfies the properties it should have. Therefore, multiplying the actual probability distribution $P(x)$ to suprisal $-log \ Q(x)$ and adding it all up gives us average bits for representing the information which is the cross-entropy.  