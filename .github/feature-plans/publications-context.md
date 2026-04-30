### pulication_target.proto

syntax = "proto3";

package canonical.landscape.debarchive.v1;

import "buf/validate/validate.proto";
import "canonical/landscape/debarchive/v1/publication.proto";
import "canonical/landscape/debarchive/v1/task.proto";
import "google/api/annotations.proto";
import "google/api/client.proto";
import "google/api/field_behavior.proto";
import "google/api/resource.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/field_mask.proto";

// PublicationService manages the publication of Debian artifacts.
service PublicationService {
// CreatePublication creates a new Publication.
rpc CreatePublication(CreatePublicationRequest) returns (Publication) {
option (google.api.http) = {
post: "/v1/publications"
body: "publication"
};
option (google.api.method_signature) = "publication,publication_id";
}

// GetPublication retrieves a Publication by its resource name.
rpc GetPublication(GetPublicationRequest) returns (Publication) {
option (google.api.http) = {get: "/v1/{name=publications/\*}"};
option (google.api.method_signature) = "name";
}

// ListPublications returns a list of Publications.
rpc ListPublications(ListPublicationsRequest) returns (ListPublicationsResponse) {
option (google.api.http) = {get: "/v1/publications"};
option (google.api.method_signature) = "";
}

// UpdatePublication updates the details of a Publication.
rpc UpdatePublication(UpdatePublicationRequest) returns (Publication) {
option (google.api.http) = {
patch: "/v1/{publication.name=publications/\*}"
body: "publication"
};
option (google.api.method_signature) = "publication,update_mask";
}

// DeletePublication deletes a Publication.
// Note: This operation may trigger a background Task to clean up published artifacts.
rpc DeletePublication(DeletePublicationRequest) returns (google.protobuf.Empty) {
option (google.api.http) = {delete: "/v1/{name=publications/\*}"};
option (google.api.method_signature) = "name";
}

// PublishPublication triggers the actual publication process.
// This is a custom method that returns a background Task.
rpc PublishPublication(PublishPublicationRequest) returns (PublishPublicationResponse) {
option (google.api.http) = {
post: "/v1/{name=publications/_}:publish"
body: "_"
};
option (google.api.method_signature) = "name";
}
}

// CreatePublicationRequest is the request message for CreatePublication.
message CreatePublicationRequest {
// The ID to use for the publication (optional).
string publication_id = 1 [(google.api.field_behavior) = OPTIONAL];

// The publication to create.
Publication publication = 2 [
(google.api.field_behavior) = REQUIRED,

    (buf.validate.field).required = true,

    (buf.validate.field).cel = {
      id: "publication_target.required"
      message: "publication target is required"
      expression: "this.publication_target.size() > 0"
    },

    (buf.validate.field).cel = {
      id: "mirror.required"
      message: "mirror is required"
      expression: "this.mirror.size() > 0"
    }

];
}

// GetPublicationRequest is the request message for GetPublication.
message GetPublicationRequest {
// The resource name of the publication to retrieve.
// Format: "publications/{publication}"
string name = 1 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/Publication"},
(buf.validate.field).required = true
];
}

// UpdatePublicationRequest is the request message for UpdatePublication.
message UpdatePublicationRequest {
// The publication to update.
Publication publication = 1 [
(google.api.field_behavior) = REQUIRED,

    (buf.validate.field).required = true,

    (buf.validate.field).cel = {
      id: "name.required"
      message: "name is required"
      expression: "this.name.size() > 0"
    }

];

// The list of fields to update.
google.protobuf.FieldMask update_mask = 2 [(google.api.field_behavior) = OPTIONAL];
}

// DeletePublicationRequest is the request message for DeletePublication.
message DeletePublicationRequest {
// The resource name of the publication to delete.
// Format: "publications/{publication}"
string name = 1 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/Publication"},
(buf.validate.field).required = true
];
}

// ListPublicationsRequest is the request message for ListPublications.
message ListPublicationsRequest {
// The maximum number of publications to return.
// The service may return fewer than this value.
// If unspecified, at most 100 publications will be returned.
// The maximum value is 1000; values above 1000 will be coerced to 1000.
int32 page_size = 1 [(google.api.field_behavior) = OPTIONAL];

// A page token, received from a previous `ListPublication` call.
// Provide this to retrieve the subsequent page.
//
// When paginating, all other parameters provided to `ListPublication` must match
// the call that provided the page token.
string page_token = 2 [(google.api.field_behavior) = OPTIONAL];
}

// ListPublicationsResponse is the response message for ListPublications.
message ListPublicationsResponse {
// A list of publications.
repeated Publication publications = 1;

// A token, which can be sent as `page_token` to retrieve the next page.
// If this field is omitted, there are no subsequent pages.
string next_page_token = 2;
}

// PublishPublicationRequest is the request message for PublishPublication.
message PublishPublicationRequest {
// The resource name of the publication to publish.
// Format: "publications/{publication}"
string name = 1 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/Publication"},
(buf.validate.field).required = true
];

// Force overwrite of existing artifacts.
bool force_overwrite = 2 [(google.api.field_behavior) = OPTIONAL];

// Force cleanup of old artifacts.
bool force_cleanup = 3 [(google.api.field_behavior) = OPTIONAL];
}

// PublishPublicationResponse is the response message for PublishPublication.
message PublishPublicationResponse {
// The resulting task from a sync mirror.
Task task = 1;
}

### pulication_target_service.proto

syntax = "proto3";

package canonical.landscape.debarchive.v1;

import "buf/validate/validate.proto";
import "canonical/landscape/debarchive/v1/publication_target.proto";
import "google/api/annotations.proto";
import "google/api/client.proto";
import "google/api/field_behavior.proto";
import "google/api/resource.proto";
import "google/protobuf/empty.proto";
import "google/protobuf/field_mask.proto";

// PublicationTargetService manages the storage destinations for Debian archives.
service PublicationTargetService {
// CreatePublicationTarget creates a new PublicationTarget.
rpc CreatePublicationTarget(CreatePublicationTargetRequest) returns (PublicationTarget) {
option (google.api.http) = {
post: "/v1/publicationTargets"
body: "publication_target"
};
option (google.api.method_signature) = "publication_target,publication_target_id";
}

// GetPublicationTarget gets details of a single PublicationTarget.
rpc GetPublicationTarget(GetPublicationTargetRequest) returns (PublicationTarget) {
option (google.api.http) = {get: "/v1/{name=publicationTargets/\*}"};
option (google.api.method_signature) = "name";
}

// ListPublicationTargets lists all PublicationTargets.
rpc ListPublicationTargets(ListPublicationTargetsRequest) returns (ListPublicationTargetsResponse) {
option (google.api.http) = {get: "/v1/publicationTargets"};
option (google.api.method_signature) = "";
}

// UpdatePublicationTarget replaces (full replacement) an existing PublicationTarget.
rpc UpdatePublicationTarget(UpdatePublicationTargetRequest) returns (PublicationTarget) {
option (google.api.http) = {
patch: "/v1/{publication_target.name=publicationTargets/\*}"
body: "publication_target"
};
option (google.api.method_signature) = "publication_target,update_mask";
}

// DeletePublicationTarget deletes a PublicationTarget.
rpc DeletePublicationTarget(DeletePublicationTargetRequest) returns (google.protobuf.Empty) {
option (google.api.http) = {delete: "/v1/{name=publicationTargets/\*}"};
option (google.api.method_signature) = "name";
}
}

// CreatePublicationTargetRequest is the request message for CreatePublicationTarget.
message CreatePublicationTargetRequest {
// The ID to use for the publication target (optional).
// If not provided, the server will generate one.
string publication_target_id = 1 [(google.api.field_behavior) = OPTIONAL];

// The resource to create.
PublicationTarget publication_target = 2 [
(google.api.field_behavior) = REQUIRED,

    (buf.validate.field).required = true,

    (buf.validate.field).cel = {
      id: "display_name.required"
      message: "display name is required"
      expression: "this.display_name.size() > 0"
    },

    (buf.validate.field).cel = {
      id: "target.required"
      message: "target is required"
      expression: "has(this.s3) || has(this.swift)"
    },

    (buf.validate.field).cel = {
      id: "s3.region.required"
      message: "s3 region is required"
      expression: "has(this.s3) ? this.s3.region.size() > 0 : true"
    },

    (buf.validate.field).cel = {
      id: "s3.bucket.required"
      message: "s3 bucket is required"
      expression: "has(this.s3) ? this.s3.bucket.size() > 0 : true"
    },

    (buf.validate.field).cel = {
      id: "s3.aws_access_key_id.required"
      message: "s3 aws access key id is required"
      expression: "has(this.s3) ? this.s3.aws_access_key_id.size() > 0 : true"
    },

    (buf.validate.field).cel = {
      id: "s3.aws_secret_access_key.required"
      message: "s3 aws secret access key is required"
      expression: "has(this.s3) ? this.s3.aws_secret_access_key.size() > 0 : true"
    },

    (buf.validate.field).cel = {
      id: "swift.container.required"
      message: "swift container name is required"
      expression: "has(this.swift) ? this.swift.container.size() > 0 : true"
    },

    (buf.validate.field).cel = {
      id: "swift.username.required"
      message: "swift username is required"
      expression: "has(this.swift) ? this.swift.username.size() > 0 : true"
    },

    (buf.validate.field).cel = {
      id: "swift.password.required"
      message: "swift password is required"
      expression: "has(this.swift) ? this.swift.password.size() > 0 : true"
    }

];
}

// GetPublicationTargetRequest is the request message for GetPublicationTarget.
message GetPublicationTargetRequest {
// The name of the publication target to retrieve.
// Format: "publicationTargets/{publication_target}"
string name = 1 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/PublicationTarget"},
(buf.validate.field).required = true
];
}

// ListPublicationTargetsRequest is the request message for ListPublicationTargets.
message ListPublicationTargetsRequest {
// The maximum number of publication targets to return.
// The service may return fewer than this value.
// If unspecified, at most 100 publication targets will be returned.
// The maximum value is 1000; values above 1000 will be coerced to 1000.
int32 page_size = 1 [(google.api.field_behavior) = OPTIONAL];

// A page token, received from a previous `ListPublicationTargets` call.
// Provide this to retrieve the subsequent page.
//
// When paginating, all other parameters provided to `ListPublicationTargets` must match
// the call that provided the page token.
string page_token = 2 [(google.api.field_behavior) = OPTIONAL];
}

// ListPublicationTargetsResponse is the response message for ListPublicationTargets.
message ListPublicationTargetsResponse {
// The publication targets.
repeated PublicationTarget publication_targets = 1;

// A token, which can be sent as `page_token` to retrieve the next page.
// If this field is omitted, there are no subsequent pages.
string next_page_token = 2;
}

// UpdatePublicationTargetRequest is the request message for UpdatePublicationTarget.
message UpdatePublicationTargetRequest {
// The resource to update.
PublicationTarget publication_target = 1 [
(google.api.field_behavior) = REQUIRED,

    (buf.validate.field).required = true,

    (buf.validate.field).cel = {
      id: "name.required"
      message: "name is required"
      expression: "this.name.size() > 0"
    }

];

// The list of fields to update.
google.protobuf.FieldMask update_mask = 2 [(google.api.field_behavior) = OPTIONAL];
}

// DeletePublicationTargetRequest is the request message for DeletePublicationTarget.
message DeletePublicationTargetRequest {
// The name of the publication target to delete.
// Format: "publicationTargets/{publication_target}"
string name = 1 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/PublicationTarget"},
(buf.validate.field).required = true
];
}

### publication.proto

syntax = "proto3";

package canonical.landscape.debarchive.v1;

import "canonical/landscape/debarchive/v1/gpg_key.proto";
import "google/api/field_behavior.proto";
import "google/api/resource.proto";

// Publication represents the configuration for publishing Debian artifacts
// from a Source (Mirror) to a Target.
message Publication {
option (google.api.resource) = {
type: "landscape.canonical.com/Publication"
pattern: "publications/{publication}"
singular: "publication"
plural: "publications"
};

// The resource name of the publication.
// Format: "publications/{uuid}"
string name = 1 [(google.api.field_behavior) = IDENTIFIER];

// The publication ID (UUID) is exposed separately for convenience.
string publication_id = 2 [(google.api.field_behavior) = OUTPUT_ONLY];

// The resource name of the publication target.
// Format: "publicationTargets/{publication_target}"
string publication_target = 3 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/PublicationTarget"}
];

// The resource name of the source mirror.
// Format: "mirrors/{mirror}"
string mirror = 4 [
(google.api.field_behavior) = REQUIRED,
(google.api.resource_reference) = {type: "landscape.canonical.com/Mirror"}
];

// The name of the distribution.
// Inferred from the source if omitted.
string distribution = 5 [(google.api.field_behavior) = OPTIONAL];

// The name of the component to publish.
// Inferred from the source if omitted.
string component = 6 [(google.api.field_behavior) = OPTIONAL];

// Value for the `Label:` field in the Release file.
string label = 7 [(google.api.field_behavior) = OPTIONAL];

// Value for the `Origin:` field in the Release file.
// Inferred from the source if omitted.
string origin = 8 [(google.api.field_behavior) = OPTIONAL];

// List of architectures to publish.
// Defaults to all source architectures if omitted.
repeated string architectures = 9 [
(google.api.field_behavior) = OPTIONAL,
(google.api.field_behavior) = UNORDERED_LIST
];

// Provides index file by hash if unique.
// (-- api-linter: core::0140::prepositions=disabled --)
bool acquire_by_hash = 10 [(google.api.field_behavior) = OPTIONAL];

// Sets `ButAutomaticUpgrade: yes|no` in the Release file if provided.
// (-- api-linter: core::0140::prepositions=disabled --)
optional bool but_automatic_upgrades = 11 [(google.api.field_behavior) = OPTIONAL];

// Sets `NotAutomatic: yes|no` in the Release file if provided.
optional bool not_automatic = 12 [(google.api.field_behavior) = OPTIONAL];

// Indicates if multiple distributions are supported.
bool multi_dist = 13 [(google.api.field_behavior) = OPTIONAL];

// Indicates if bz2 compression should be skipped for index files.
bool skip_bz2 = 14 [(google.api.field_behavior) = OPTIONAL];

// Indicates if content indexes should not be generated.
bool skip_contents = 15 [(google.api.field_behavior) = OPTIONAL];

// Optional GPG key to sign the release file(s).
optional GpgKey gpg_key = 16 [(google.api.field_behavior) = OPTIONAL];
}
