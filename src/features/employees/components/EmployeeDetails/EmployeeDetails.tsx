import InfoItem from "@/components/layout/InfoItem";
import { Col, Row } from "@canonical/react-components";
import type { FC } from "react";
import type { Employee } from "../../types";
import EmployeeDetailsHeader from "../EmployeeDetailsHeader";
import EmployeeInstancesTable from "../EmployeeInstancesTable";
import NoData from "@/components/layout/NoData";

interface EmployeeDetailsProps {
  readonly employee: Employee;
}

const EmployeeDetails: FC<EmployeeDetailsProps> = ({ employee }) => {
  return (
    <>
      <EmployeeDetailsHeader employee={employee} />
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="name" value={employee.name} />
        </Col>
        <Col size={6}>
          <InfoItem label="email" value={employee.email} />
        </Col>
      </Row>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem
            label="employee groups"
            value={
              employee.groups?.map((group) => group.name)?.join(", ") || "N/A"
            }
            type="truncated"
          />
        </Col>
        <Col size={6}>
          <InfoItem
            label="status"
            value={employee.is_active ? "active" : "inactive"}
          />
        </Col>
      </Row>
      <InfoItem
        label="autoinstall file"
        value={
          employee.autoinstall_file ? (
            `${employee.autoinstall_file.filename}, v${employee.autoinstall_file.version}`
          ) : (
            <NoData />
          )
        }
      />

      <EmployeeInstancesTable instances={employee.computers} />
    </>
  );
};

export default EmployeeDetails;
