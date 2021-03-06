import { DocumentNode, FieldNode, GraphQLResolveInfo, GraphQLSchema, Kind, OperationDefinitionNode } from 'graphql';
import { FilterToSchema, MergeInfo, ReplaceFieldWithFragment, Request } from 'graphql-tools';

export function conformInfoToSchema<T extends GraphQLResolveInfo & { mergeInfo?: MergeInfo } = GraphQLResolveInfo>(
  info: T,
  schema: GraphQLSchema,
  fragments?: { field: string; fragment: string; }[],
): T {
  const document: DocumentNode = {
    definitions: [
      {
        kind: Kind.OPERATION_DEFINITION,
        operation: 'query',
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: info.fieldNodes,
        },
        variableDefinitions: [],
      },
    ],
    kind: Kind.DOCUMENT,
  };
  if (!fragments) {
    if (info.mergeInfo) {
      fragments = info.mergeInfo.fragments;
    } else {
      fragments = [];
    }
  }
  const request: Request = { document, variables: {} };
  const transformed = new FilterToSchema(schema).transformRequest(
    new ReplaceFieldWithFragment(schema, fragments).transformRequest(request),
  );
  const definition = transformed.document.definitions[0] as OperationDefinitionNode;
  return {
    ...info,
    fieldNodes: definition.selectionSet.selections as FieldNode[],
  };
}
