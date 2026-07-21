/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '$app/components/cards';
import { Button, InputField, SelectField } from '$app/components/forms';
import { Table, Tbody, Td, Th, Thead, Tr } from '$app/components/tables';
import {
  BusinessTrip,
  BusinessTripSegment,
} from '$app/common/interfaces/business-trip.interface';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '$app/common/colors';
import { CircleXMark } from '$app/components/icons/CircleXMark';
import { TRANSPORT_TYPES } from '../hooks';

interface Props {
  businessTrip: BusinessTrip | undefined;
  handleChange: <T extends keyof BusinessTrip>(
    property: T,
    value: BusinessTrip[T]
  ) => void;
}

function blankSegment(): BusinessTripSegment {
  return {
    start_location: '',
    destination: '',
    departure_date: '',
    departure_time: '',
    arrival_date: '',
    arrival_time: '',
    transport_type: 'company_car',
    vehicle: '',
    distance_km: '',
    purpose: '',
    notes: '',
  };
}

export function SegmentsTable(props: Props) {
  const [t] = useTranslation();

  const { businessTrip, handleChange } = props;

  const colors = useColorScheme();

  if (!businessTrip) {
    return null;
  }

  const segments = businessTrip.segments || [];

  const updateSegment = <T extends keyof BusinessTripSegment>(
    index: number,
    property: T,
    value: BusinessTripSegment[T]
  ) => {
    const next = segments.map((segment, i) =>
      i === index ? { ...segment, [property]: value } : segment
    );

    handleChange('segments', next);
  };

  const createRow = () => {
    handleChange('segments', [...segments, blankSegment()]);
  };

  const deleteRow = (index: number) => {
    handleChange(
      'segments',
      segments.filter((_, i) => i !== index)
    );
  };

  return (
    <Card
      title={t('trip_segments')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <div className="w-full overflow-x-auto px-4 pb-4">
        <Table>
          <Thead>
            <Th className="px-3" withoutHorizontalPadding>
              {t('date')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('start_location')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('destination')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('departure_time')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('arrival')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('transport_type')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('distance_km')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('vehicle')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('trip_purpose')}
            </Th>
            <Th className="px-3" withoutHorizontalPadding>
              {t('notes')}
            </Th>
            <Th withoutHorizontalPadding></Th>
          </Thead>

          <Tbody>
            {segments.map((segment, index) => (
              <Tr
                key={index}
                className="border-b"
                style={{ borderColor: colors.$20 }}
              >
                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    type="date"
                    value={segment.departure_date}
                    onValueChange={(value) =>
                      updateSegment(index, 'departure_date', value)
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    value={segment.start_location}
                    onValueChange={(value) =>
                      updateSegment(index, 'start_location', value)
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    value={segment.destination}
                    onValueChange={(value) =>
                      updateSegment(index, 'destination', value)
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    type="time"
                    value={segment.departure_time}
                    onValueChange={(value) =>
                      updateSegment(index, 'departure_time', value)
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <div className="flex space-x-2">
                    <InputField
                      type="date"
                      value={segment.arrival_date}
                      onValueChange={(value) =>
                        updateSegment(index, 'arrival_date', value)
                      }
                    />

                    <InputField
                      type="time"
                      value={segment.arrival_time}
                      onValueChange={(value) =>
                        updateSegment(index, 'arrival_time', value)
                      }
                    />
                  </div>
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <SelectField
                    value={segment.transport_type}
                    onValueChange={(value) =>
                      updateSegment(index, 'transport_type', value)
                    }
                  >
                    {TRANSPORT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(type)}
                      </option>
                    ))}
                  </SelectField>
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    type="number"
                    value={segment.distance_km}
                    onValueChange={(value) =>
                      updateSegment(
                        index,
                        'distance_km',
                        value === '' ? '' : parseFloat(value)
                      )
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    value={segment.vehicle}
                    onValueChange={(value) =>
                      updateSegment(index, 'vehicle', value)
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    value={segment.purpose}
                    onValueChange={(value) =>
                      updateSegment(index, 'purpose', value)
                    }
                  />
                </Td>

                <Td className="pl-3 py-3" withoutPadding>
                  <InputField
                    value={segment.notes}
                    onValueChange={(value) =>
                      updateSegment(index, 'notes', value)
                    }
                  />
                </Td>

                <Td>
                  <div
                    className="cursor-pointer"
                    onClick={() => deleteRow(index)}
                  >
                    <CircleXMark
                      color={colors.$3}
                      hoverColor={colors.$3}
                      borderColor={colors.$5}
                      hoverBorderColor={colors.$17}
                      size="1.6rem"
                    />
                  </div>
                </Td>
              </Tr>
            ))}

            <Tr>
              <Td colSpan={100} className="p-1" withoutPadding>
                <div className="flex justify-center py-2">
                  <Button
                    type="secondary"
                    behavior="button"
                    onClick={createRow}
                  >
                    {t('add_item')}
                  </Button>
                </div>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
    </Card>
  );
}
