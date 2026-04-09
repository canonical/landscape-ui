// import { scripts } from "@/tests/mocks/script";
// import { renderWithProviders } from "@/tests/render";
// import { screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { describe, expect, it } from "vitest";
// import PublicationTargetListActions from "./PublicationTargetListActions";

// STUB based on ScriptListActions test as PublicationTargetListActions does not have any logic yet, it just renders the same component as the list actions column in the ScriptList component. Once there is logic in the PublicationTargetListActions component, this test should be updated to reflect that and the stub code removed.

// const activeScript = scripts.find((script) => script.status === "ACTIVE");
// const archivedScript = scripts.find((script) => script.status === "ARCHIVED");
// const redactedScript = scripts.find((script) => script.status === "REDACTED");

// const nonExecutableActiveScript = scripts.find(
//   (script) => script.status === "ACTIVE" && !script.is_executable,
// );
// const nonEditableActiveScript = scripts.find(
//   (script) => script.status === "ACTIVE" && !script.is_editable,
// );
// const nonRedactableActiveScript = scripts.find(
//   (script) => script.status === "ACTIVE" && !script.is_redactable,
// );
// const activeScriptWithProfiles = scripts.find(
//   (script) =>
//     script.status === "ACTIVE" &&
//     script.script_profiles.length > 0 &&
//     script.is_redactable,
// );
// const activeScriptWithNoProfiles = scripts.find(
//   (script) =>
//     script.status === "ACTIVE" &&
//     script.script_profiles.length === 0 &&
//     script.is_redactable,
// );
// const archivedScriptWithProfiles = scripts.find(
//   (script) =>
//     script.status === "ACTIVE" &&
//     script.script_profiles.length > 0 &&
//     script.is_editable,
// );
// const archivedScriptWithNoProfiles = scripts.find(
//   (script) =>
//     script.status === "ACTIVE" &&
//     script.script_profiles.length === 0 &&
//     script.is_editable,
// );

// describe("Scripts List Contextual Menu", () => {
//   const user = userEvent.setup();

//   assert(activeScript);
//   assert(archivedScript);
//   assert(redactedScript);
//   assert(nonExecutableActiveScript);
//   assert(nonEditableActiveScript);
//   assert(nonRedactableActiveScript);
//   assert(activeScriptWithProfiles);
//   assert(activeScriptWithNoProfiles);
//   assert(archivedScriptWithProfiles);
//   assert(archivedScriptWithNoProfiles);

//   describe("contextual menu buttons", async () => {
//     it("should render the contextual menu for any script", async () => {
//       renderWithProviders(<ScriptListActions script={activeScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScript.title} actions`,
//       });

//       expect(contextualMenuButton).toBeInTheDocument();
//       expect(contextualMenuButton).toHaveAttribute("aria-expanded", "false");

//       await user.click(contextualMenuButton);
//       expect(contextualMenuButton).toHaveAttribute("aria-expanded", "true");

//       expect(
//         screen.getByRole("menuitem", {
//           name: `View details for ${activeScript.title} script`,
//         }),
//       ).toBeInTheDocument();
//     });

//     it("should render the contextual menu for an active script", async () => {
//       renderWithProviders(<ScriptListActions script={activeScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       expect(
//         screen.getByRole("menuitem", {
//           name: `Edit ${activeScript.title} script`,
//         }),
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole("menuitem", {
//           name: `Archive ${activeScript.title} script`,
//         }),
//       ).toBeInTheDocument();
//       expect(
//         screen.getByRole("menuitem", {
//           name: `Delete ${activeScript.title} script`,
//         }),
//       ).toBeInTheDocument();
//     });

//     it("should render the contextual menu for an archived script", async () => {
//       renderWithProviders(<ScriptListActions script={archivedScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${archivedScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       expect(
//         screen.queryByRole("button", {
//           name: `Edit ${archivedScript.title} script`,
//         }),
//       ).not.toBeInTheDocument();
//       expect(
//         screen.queryByRole("button", {
//           name: `Archive ${archivedScript.title} script`,
//         }),
//       ).not.toBeInTheDocument();
//       expect(
//         screen.getByRole("menuitem", {
//           name: `Delete ${archivedScript.title} script`,
//         }),
//       ).toBeInTheDocument();
//     });

//     it("should render the contextual menu for a redacted script", async () => {
//       renderWithProviders(<ScriptListActions script={redactedScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${redactedScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       expect(
//         screen.queryByRole("button", {
//           name: `Edit ${redactedScript.title} script`,
//         }),
//       ).not.toBeInTheDocument();
//       expect(
//         screen.queryByRole("button", {
//           name: `Archive ${redactedScript.title} script`,
//         }),
//       ).not.toBeInTheDocument();
//       expect(
//         screen.queryByRole("button", {
//           name: `Delete ${redactedScript.title} script`,
//         }),
//       ).not.toBeInTheDocument();
//     });

//     it("should render the contextual menu for a non-executable script", async () => {
//       renderWithProviders(
//         <ScriptListActions script={nonExecutableActiveScript} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${nonExecutableActiveScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const runMenuItem = screen.queryByRole("menuitem", {
//         name: `Run ${nonExecutableActiveScript.title} script`,
//       });

//       expect(runMenuItem).toBeInTheDocument();
//       expect(runMenuItem).toHaveAttribute("aria-disabled", "true");
//     });

//     it("should render the contextual menu for a non-editable script", async () => {
//       renderWithProviders(
//         <ScriptListActions script={nonEditableActiveScript} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${nonEditableActiveScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const editMenuItem = screen.queryByRole("menuitem", {
//         name: `Edit ${nonEditableActiveScript.title} script`,
//       });

//       expect(editMenuItem).toBeInTheDocument();
//       expect(editMenuItem).toHaveAttribute("aria-disabled", "true");
//     });

//     it("should render the contextual menu for a non-redactable script", async () => {
//       renderWithProviders(
//         <ScriptListActions script={nonRedactableActiveScript} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${nonRedactableActiveScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const deleteMenuItem = screen.queryByRole("menuitem", {
//         name: `Delete ${nonRedactableActiveScript.title} script`,
//       });

//       expect(deleteMenuItem).toBeInTheDocument();
//       expect(deleteMenuItem).toHaveAttribute("aria-disabled", "true");
//     });
//   });

//   describe("contextual menu modals", () => {
//     it("should open the delete modal with script profiles when the delete button is clicked", async () => {
//       renderWithProviders(
//         <ScriptListActions script={activeScriptWithProfiles} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScriptWithProfiles.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const deleteMenuItem = screen.getByRole("menuitem", {
//         name: `Delete ${activeScriptWithProfiles.title} script`,
//       });

//       await user.click(deleteMenuItem);

//       const deleteModal = screen.getByRole("dialog", {
//         name: `Delete ${activeScriptWithProfiles.title}`,
//       });
//       expect(deleteModal).toBeInTheDocument();

//       const list = screen.getByRole("list");
//       expect(list).toBeInTheDocument();
//     });

//     it("should open the delete modal with no script profiles when the delete button is clicked", async () => {
//       renderWithProviders(
//         <ScriptListActions script={activeScriptWithNoProfiles} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScriptWithNoProfiles.title} actions`,
//       });
//       await user.click(contextualMenuButton);

//       const deleteMenuItem = screen.getByRole("menuitem", {
//         name: `Delete ${activeScriptWithNoProfiles.title} script`,
//       });
//       expect(deleteMenuItem).toBeInTheDocument();

//       await user.click(deleteMenuItem);
//       const deleteModal = screen.getByRole("dialog", {
//         name: `Delete ${activeScriptWithNoProfiles.title}`,
//       });
//       expect(deleteModal).toBeInTheDocument();

//       const list = screen.queryByRole("list");
//       expect(list).not.toBeInTheDocument();

//       expect(
//         screen.getByText(
//           /deleting the script will remove the contents from Landscape./i,
//         ),
//       ).toBeInTheDocument();
//     });

//     it("should open the archive modal with script profiles when the archive button is clicked", async () => {
//       renderWithProviders(
//         <ScriptListActions script={archivedScriptWithProfiles} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${archivedScriptWithProfiles.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const archiveMenuItem = screen.getByRole("menuitem", {
//         name: `Archive ${archivedScriptWithProfiles.title} script`,
//       });

//       await user.click(archiveMenuItem);

//       const archiveModal = screen.getByRole("dialog", {
//         name: `Archive ${archivedScriptWithProfiles.title}`,
//       });
//       expect(archiveModal).toBeInTheDocument();

//       const list = screen.getByRole("list");
//       expect(list).toBeInTheDocument();
//     });

//     it("should open the archive modal with no script profiles when the archive button is clicked", async () => {
//       renderWithProviders(
//         <ScriptListActions script={archivedScriptWithNoProfiles} />,
//       );
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${archivedScriptWithNoProfiles.title} actions`,
//       });
//       await user.click(contextualMenuButton);

//       const archiveMenuItem = screen.getByRole("menuitem", {
//         name: `Archive ${archivedScriptWithNoProfiles.title} script`,
//       });
//       expect(archiveMenuItem).toBeInTheDocument();

//       await user.click(archiveMenuItem);
//       const archiveModal = screen.getByRole("dialog", {
//         name: `Archive ${archivedScriptWithNoProfiles.title}`,
//       });
//       expect(archiveModal).toBeInTheDocument();

//       const list = screen.queryByRole("list");
//       expect(list).not.toBeInTheDocument();

//       expect(
//         screen.getByText(
//           /archiving the script will prevent it from running in the future./i,
//         ),
//       ).toBeInTheDocument();
//     });
//   });

//   describe("contextual menu side panels", () => {
//     it("should open the details side panel when the view details button is clicked", async () => {
//       renderWithProviders(<ScriptListActions script={activeScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const viewDetailsMenuItem = screen.getByRole("menuitem", {
//         name: `View details for ${activeScript.title} script`,
//       });

//       await user.click(viewDetailsMenuItem);

//       const sidePanel = screen.getByRole("complementary");
//       const header = screen.getByRole("heading", {
//         name: activeScript.title,
//       });

//       expect(header).toBeInTheDocument();
//       expect(sidePanel).toBeInTheDocument();
//     });

//     it("should open the edit side panel when the edit button is clicked", async () => {
//       renderWithProviders(<ScriptListActions script={activeScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const editMenuItem = screen.getByRole("menuitem", {
//         name: `Edit ${activeScript.title} script`,
//       });

//       await user.click(editMenuItem);

//       const sidePanel = screen.getByRole("complementary");
//       const header = screen.getByRole("heading", {
//         name: `Edit "${activeScript.title}" script`,
//       });

//       expect(header).toBeInTheDocument();
//       expect(sidePanel).toBeInTheDocument();
//     });

//     it("should open the run side panel when the run button is clicked", async () => {
//       renderWithProviders(<ScriptListActions script={activeScript} />);
//       const contextualMenuButton = screen.getByRole("button", {
//         name: `${activeScript.title} actions`,
//       });

//       await user.click(contextualMenuButton);

//       const runMenuItem = screen.getByRole("menuitem", {
//         name: `Run ${activeScript.title} script`,
//       });

//       await user.click(runMenuItem);

//       const sidePanel = screen.getByRole("complementary");
//       const header = screen.getByRole("heading", {
//         name: `Run "${activeScript.title}" script`,
//       });

//       expect(sidePanel).toBeInTheDocument();
//       expect(header).toBeInTheDocument();
//     });
//   });
// });
