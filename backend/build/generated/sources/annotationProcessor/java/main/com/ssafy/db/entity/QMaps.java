package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QMaps is a Querydsl query type for Maps
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QMaps extends EntityPathBase<Maps> {

    private static final long serialVersionUID = 846287193L;

    public static final QMaps maps = new QMaps("maps");

    public final StringPath lat = createString("lat");

    public final StringPath lng = createString("lng");

    public final NumberPath<Long> mapSeq = createNumber("mapSeq", Long.class);

    public final NumberPath<Long> roomSeq = createNumber("roomSeq", Long.class);

    public final StringPath title = createString("title");

    public QMaps(String variable) {
        super(Maps.class, forVariable(variable));
    }

    public QMaps(Path<? extends Maps> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMaps(PathMetadata metadata) {
        super(Maps.class, metadata);
    }

}

