package datastructures;

public interface ITransformerGraph<T> {
    /**
     * Adds a vertex to the graph
     */
    boolean add(T vertex);

    /**
     * Connects two vertices in the graph
     */
    void connect(T from, T to);

    /**
     * Disconnects two vertices in the graph
     */
    boolean disconnect(T from, T to);

    /**
     * Checks if the vertex is contained within the graph
     */
    boolean contains(T vertex);

    /**
     * Checks if two vertices are connected
     */
    boolean isConnected(T from, T to);

    /**
     * Removes a vertex from the graph
     */
    boolean remove(Object vertex);

    /**
     * Returns the number of vertices in the graph
     */
    int size();
}
