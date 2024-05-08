package datastructures;

import java.util.List;

public class TransformerGraph<T> implements ITransformerGraph<T> {
    public class TransformerVertex {
        T data;
        List<TransformerVertex> connections;
    }

    List<TransformerVertex> vertices;

    @Override
    public boolean add(T vertex) {
        return false;
    }

    @Override
    public void connect(T from, T to) {
        TransformerVertex fromVertex = getVertex(from);
        TransformerVertex toVertex = getVertex(to);
        fromVertex.connections.add(toVertex);
        toVertex.connections.add(fromVertex);
    }

    @Override
    public boolean disconnect(T from, T to) {
        TransformerVertex fromVertex = getVertex(from);
        TransformerVertex toVertex = getVertex(to);
        boolean fromRemove = fromVertex.connections.remove(toVertex);
        boolean toRemove = toVertex.connections.remove(fromVertex);
        return fromRemove && toRemove;
    }

    @Override
    public boolean contains(T vertex) {
        return getVertex(vertex) != null;
    }

    @Override
    public boolean isConnected(T from, T to) {
        TransformerVertex fromVertex = getVertex(from);
        TransformerVertex toVertex = getVertex(to);
        return fromVertex.connections.contains(toVertex);
    }

    @Override
    public boolean remove(Object vertex) throws ClassCastException {
        if (vertex == null) {
            return false;
        }

        TransformerVertex vertexToRemove = getVertex((T) vertex);
        if (vertexToRemove == null) {
            return false;
        }

        // remove all connections to this vertex
        vertices.stream()
                .filter(v -> v.connections.contains(vertexToRemove))
                .forEach(v -> v.connections.remove(vertexToRemove));

        vertices.remove(vertexToRemove);

        return true;
    }

    /**
     * Get the vertex where the data .equals the given data.
     */
    TransformerVertex getVertex(T data) {
        for (TransformerVertex vertex : vertices) {
            if (vertex.data.equals(data)) {
                return vertex;
            }
        }
        return null;
    }

    @Override
    public int size() {
        return vertices.size();
    }
}
