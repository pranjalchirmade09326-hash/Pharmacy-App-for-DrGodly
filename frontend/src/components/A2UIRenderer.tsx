import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, Image } from 'react-native';
import { colors } from '../theme/colors';

// A2UI Component Specification Type
export interface A2UIComponent {
  id: string;
  type: 'Text' | 'Button' | 'Card' | 'Column' | 'Row' | 'Badge' | 'Image';
  content?: string;
  label?: string;
  action?: string;
  payload?: any;
  imageUrl?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'chip' | 'outline' | 'selected' | 'title' | 'body' | 'caption' | 'emergency';
  children?: string[]; // Child component IDs
  selected?: boolean;
}

export interface A2UISpec {
  rootId: string;
  components: Record<string, A2UIComponent>;
}

interface Props {
  spec: A2UISpec;
  onAction?: (actionId: string, payload?: any) => void;
  style?: StyleProp<ViewStyle>;
}

export const A2UIRenderer: React.FC<Props> = ({ spec, onAction, style }) => {
  if (!spec || !spec.rootId || !spec.components) {
    return null;
  }

  const renderComponent = (componentId: string): React.ReactNode => {
    const comp = spec.components[componentId];
    if (!comp) return null;

    switch (comp.type) {
      case 'Text': {
        const textStyle: StyleProp<TextStyle>[] = [styles.text];
        if (comp.variant === 'title') textStyle.push(styles.textTitle);
        if (comp.variant === 'caption') textStyle.push(styles.textCaption);
        if (comp.variant === 'danger' || comp.variant === 'emergency') textStyle.push(styles.textDanger);
        return (
          <Text key={comp.id} style={textStyle}>
            {comp.content || comp.label || ''}
          </Text>
        );
      }

      case 'Badge': {
        const isEmergency = comp.variant === 'danger' || comp.variant === 'emergency';
        return (
          <View key={comp.id} style={[styles.badge, isEmergency && styles.badgeDanger]}>
            <Text style={[styles.badgeText, isEmergency && styles.badgeTextDanger]}>
              {comp.content || comp.label || ''}
            </Text>
          </View>
        );
      }

      case 'Button': {
        const btnStyles: StyleProp<ViewStyle>[] = [styles.button];
        const textStyles: StyleProp<TextStyle>[] = [styles.buttonText];

        if (comp.variant === 'danger' || comp.variant === 'emergency') {
          btnStyles.push(styles.buttonDanger);
          textStyles.push(styles.buttonTextDanger);
        } else if (comp.variant === 'chip') {
          btnStyles.push(styles.buttonChip);
          textStyles.push(styles.buttonTextChip);
          if (comp.selected) {
            btnStyles.push(styles.buttonChipSelected);
            textStyles.push(styles.buttonTextChipSelected);
          }
        } else if (comp.variant === 'secondary' || comp.variant === 'outline') {
          btnStyles.push(styles.buttonOutline);
          textStyles.push(styles.buttonTextOutline);
        }

        return (
          <TouchableOpacity
            key={comp.id}
            style={btnStyles}
            onPress={() => comp.action && onAction?.(comp.action, comp.payload)}
            activeOpacity={0.75}
          >
            <Text style={textStyles}>{comp.label || comp.content || ''}</Text>
          </TouchableOpacity>
        );
      }

      case 'Card':
      case 'Column': {
        const isCard = comp.type === 'Card';
        const cardStyle: StyleProp<ViewStyle>[] = [isCard ? styles.card : styles.column];
        if (comp.variant === 'danger' || comp.variant === 'emergency') {
          cardStyle.push(styles.cardEmergency);
        }
        return (
          <View key={comp.id} style={cardStyle}>
            {comp.children?.map(childId => renderComponent(childId))}
          </View>
        );
      }

      case 'Image': {
        if (!comp.imageUrl) return null;
        return (
          <Image
            key={comp.id}
            source={{ uri: comp.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        );
      }

      case 'Row':
        return (
          <View key={comp.id} style={styles.row}>
            {comp.children?.map(childId => renderComponent(childId))}
          </View>
        );

      default:
        return null;
    }
  };

  return <View style={[styles.container, style]}>{renderComponent(spec.rootId)}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  column: {
    flexDirection: 'column',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginVertical: 6,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginVertical: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmergency: {
    backgroundColor: '#FEF2F2',
    borderColor: colors.redEmergency,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  textTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  textCaption: {
    fontSize: 12,
    color: colors.textMuted,
  },
  textDanger: {
    color: colors.redEmergency,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeDanger: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  badgeTextDanger: {
    color: colors.redEmergency,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  buttonDanger: {
    backgroundColor: colors.redEmergency,
  },
  buttonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 2,
  },
  buttonChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  buttonTextDanger: {
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    color: colors.primary,
  },
  buttonTextChip: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonTextChipSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default A2UIRenderer;
